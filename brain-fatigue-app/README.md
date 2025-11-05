# Brain Fatigue Assessment Tool

An interactive web application for monitoring cognitive performance and fatigue levels through scientifically-based assessments.

## Features

### 1. Reaction Time Test
- Measures response speed across 5 trials
- Helps identify psychomotor slowing associated with fatigue
- Results displayed in milliseconds

### 2. Memory Test
- Progressive digit span test (3-7 digits)
- Assesses working memory capacity
- 5 rounds of increasing difficulty

### 3. Attention Test
- 30-second sustained attention task
- Go/No-Go paradigm (respond only to letter 'X')
- Measures vigilance and response inhibition

### 4. Fatigue Questionnaire
- 5-item self-report questionnaire
- Based on validated fatigue assessment scales
- Covers tiredness, concentration, drowsiness, motivation, and energy levels

## Assessment Scoring

The app calculates an **Overall Fatigue Level** (0-100%) based on:
- Reaction time performance (25% weight)
- Memory accuracy (25% weight)
- Attention performance (25% weight)
- Self-reported fatigue (25% weight)

### Fatigue Levels
- **0-30%**: Low fatigue - Performing well
- **30-60%**: Moderate fatigue - Consider taking a break
- **60-100%**: High fatigue - Rest recommended

## Usage

1. Open `index.html` in a web browser
2. Click "Start Assessment" to begin
3. Complete all four sections in sequence
4. View your detailed results with performance metrics
5. Access your assessment history to track changes over time

## Data Storage

- Assessment history is stored locally in the browser using localStorage
- No data is sent to external servers
- History is limited to the last 10 assessments
- Users can clear their history at any time

## Technical Details

- **Pure HTML/CSS/JavaScript** - No external dependencies
- **Responsive design** - Works on desktop and mobile devices
- **Modern UI** - Gradient backgrounds and smooth animations
- **Accessible** - Clear instructions and visual feedback

## Deployment

### GitHub Pages
1. Push the `brain-fatigue-app` directory to your repository
2. Enable GitHub Pages in repository settings
3. Set source to the branch containing the app
4. Access at: `https://[username].github.io/[repo-name]/brain-fatigue-app/`

### Local Testing
Simply open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).

## Use Cases

- Research on cognitive fatigue
- Self-monitoring during long work sessions
- Pre/post-break assessments
- Sleep deprivation studies
- Shift work monitoring
- Student study session optimization

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Privacy

All assessments are stored locally on your device. The application:
- Does not collect personal information
- Does not send data to external servers
- Does not use cookies or tracking
- Can be used completely offline after initial load

## Future Enhancements

Potential features for future versions:
- Data export (CSV/JSON)
- Customizable test parameters
- Additional cognitive tests
- Trend visualization charts
- Multi-user support
- Test reminders/scheduling

## License

This is open-source software. Feel free to use, modify, and distribute.

## Credits

Developed as an interactive tool for cognitive performance monitoring and fatigue assessment.
