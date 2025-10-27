import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { COMMUNITIES, TOPICS, CommunityType, TopicType } from '../types/database';
import { calculateReadingTime } from '../utils/readingTime';
import { uploadImage, validateImageFile } from '../utils/imageUpload';
import { Image, Tag, Save, Eye, Upload, X } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DynamicIcon from '../components/DynamicIcon';

export default function WritePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const quillRef = useRef<ReactQuill>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedCommunities, setSelectedCommunities] = useState<CommunityType[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<TopicType[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data.author_id !== user?.id) {
        navigate('/feed');
        return;
      }

      setTitle(data.title);
      setContent(data.content);
      setExcerpt(data.excerpt || '');
      setCoverImage(data.cover_image || '');
      setTags(data.tags || []);
      setSelectedCommunities(data.communities || []);
      setSelectedTopics(data.topics || []);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const toggleCommunity = (community: CommunityType) => {
    setSelectedCommunities((prev) =>
      prev.includes(community) ? prev.filter((c) => c !== community) : [...prev, community]
    );
  };

  const toggleTopic = (topic: TopicType) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      validateImageFile(file, 10); // Max 10MB for cover images
      setUploadingCover(true);

      const publicUrl = await uploadImage(file, 'covers', user.id);
      setCoverImage(publicUrl);
    } catch (error: any) {
      alert(error.message || 'Failed to upload cover image');
    } finally {
      setUploadingCover(false);
    }
  };

  // Image upload handler for Quill editor
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !user) return;

      try {
        validateImageFile(file, 5); // Max 5MB for inline images

        // Show uploading state
        const quill = quillRef.current?.getEditor();
        if (!quill) return;

        const range = quill.getSelection(true);
        quill.insertText(range.index, 'Uploading image...');

        // Upload image
        const publicUrl = await uploadImage(file, 'covers', user.id);

        // Remove uploading text and insert image
        quill.deleteText(range.index, 'Uploading image...'.length);
        quill.insertEmbed(range.index, 'image', publicUrl);
        quill.setSelection(range.index + 1, 0);
      } catch (error: any) {
        alert(error.message || 'Failed to upload image');
      }
    };
  };

  const saveDraft = async () => {
    if (!user || !title.trim()) return;

    setSaving(true);
    try {
      const readingTime = calculateReadingTime(content);
      const postData = {
        author_id: user.id,
        title: title.trim(),
        content,
        excerpt: excerpt.trim() || null,
        cover_image: coverImage.trim() || null,
        tags,
        communities: selectedCommunities,
        topics: selectedTopics,
        reading_time: readingTime,
        is_published: false,
      };

      if (id) {
        const { error } = await supabase.from('posts').update(postData).eq('id', id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('posts').insert(postData).select().single();
        if (error) throw error;
        navigate(`/write/${data.id}`, { replace: true });
      }

      alert('Draft saved!');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!user || !title.trim() || !content.trim()) {
      alert('Please fill in title and content');
      return;
    }

    setLoading(true);
    try {
      const readingTime = calculateReadingTime(content);
      const postData = {
        author_id: user.id,
        title: title.trim(),
        content,
        excerpt: excerpt.trim() || content.substring(0, 200),
        cover_image: coverImage.trim() || null,
        tags,
        communities: selectedCommunities,
        topics: selectedTopics,
        reading_time: readingTime,
        is_published: true,
        published_at: new Date().toISOString(),
      };

      if (id) {
        const { error } = await supabase.from('posts').update(postData).eq('id', id);
        if (error) throw error;
        navigate(`/post/${id}`);
      } else {
        const { data, error } = await supabase.from('posts').insert(postData).select().single();
        if (error) throw error;
        navigate(`/post/${data.id}`);
      }
    } catch (error) {
      console.error('Error publishing post:', error);
      alert('Failed to publish post');
    } finally {
      setLoading(false);
    }
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['blockquote', 'code-block'],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold gradient-text">
            {id ? 'Edit Post' : 'Write a New Post'}
          </h1>
          <div className="flex gap-3">
            <button
              onClick={saveDraft}
              disabled={saving || !title.trim()}
              className="btn btn-secondary flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={handlePublish}
              disabled={loading || !title.trim() || !content.trim()}
              className="btn btn-primary flex items-center gap-2"
            >
              <Eye className="w-5 h-5" />
              {loading ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Cover Image */}
          <div className="card p-6">
            <label className="block text-sm font-medium text-cyber-200 mb-2">
              <Image className="w-5 h-5 inline mr-2" />
              Cover Image
            </label>

            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverImageUpload}
              className="hidden"
            />

            {coverImage ? (
              <div className="relative">
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  onClick={() => setCoverImage('')}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg"
                  title="Remove cover image"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => coverInputRef.current?.click()}
                disabled={uploadingCover}
                className="w-full h-64 border-2 border-dashed border-cyber-700/50 rounded-lg flex flex-col items-center justify-center gap-3 hover:border-cyber-500 hover:bg-cyber-800/30 transition-colors"
              >
                <Upload className="w-12 h-12 text-cyber-400" />
                <span className="text-cyber-200">
                  {uploadingCover ? 'Uploading...' : 'Click to upload cover image'}
                </span>
                <span className="text-sm text-cyber-400">
                  JPEG, PNG, WebP, or GIF (max 10MB)
                </span>
              </button>
            )}
          </div>

          {/* Title */}
          <div className="card p-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your amazing title..."
              className="w-full text-4xl font-bold outline-none border-none p-0 bg-transparent text-cyber-50 placeholder-cyber-600"
            />
          </div>

          {/* Excerpt */}
          <div className="card p-6">
            <label className="block text-sm font-medium text-cyber-200 mb-2">
              Excerpt (optional)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A brief summary of your post..."
              rows={3}
              className="input resize-none"
            />
          </div>

          {/* Content */}
          <div className="card p-6">
            <label className="block text-sm font-medium text-cyber-200 mb-2">
              Content
            </label>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              placeholder="Tell your story..."
            />
          </div>

          {/* Tags */}
          <div className="card p-6">
            <label className="block text-sm font-medium text-cyber-200 mb-2">
              <Tag className="w-5 h-5 inline mr-2" />
              Tags
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add a tag..."
                className="input flex-1"
              />
              <button onClick={handleAddTag} className="btn btn-primary">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="badge badge-primary flex items-center gap-1">
                  #{tag}
                  <button onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-red-600">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Communities */}
          <div className="card p-6">
            <label className="block text-sm font-semibold text-white mb-3">
              Communities (select at least 1)
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMUNITIES.map((community) => (
                <button
                  key={community.value}
                  onClick={() => toggleCommunity(community.value)}
                  className={`badge flex items-center gap-2 ${
                    selectedCommunities.includes(community.value)
                      ? 'badge-primary'
                      : 'bg-cyber-800/30 text-white border-cyber-700/30'
                  }`}
                >
                  <DynamicIcon name={community.icon} size={16} />
                  {community.label}
                </button>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div className="card p-6">
            <label className="block text-sm font-semibold text-white mb-3">
              Topics (select at least 1)
            </label>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((topic) => (
                <button
                  key={topic.value}
                  onClick={() => toggleTopic(topic.value)}
                  className={`badge flex items-center gap-2 ${
                    selectedTopics.includes(topic.value)
                      ? 'badge-cyan'
                      : 'bg-cyber-800/30 text-white border-cyber-700/30'
                  }`}
                >
                  <DynamicIcon name={topic.icon} size={16} />
                  {topic.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
