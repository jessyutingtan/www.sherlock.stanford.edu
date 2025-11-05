# Core Metrics Collection Framework

## Overview

This document defines the comprehensive metrics collection system that differentiates our brain fatigue app from existing solutions. The framework employs four distinct layers of data collection, each designed to capture different aspects of cognitive fatigue with minimal user burden.

## Design Principles

1. **Minimal Friction**: Prioritize passive collection over active input
2. **Scientific Validity**: All metrics grounded in cognitive neuroscience research
3. **Privacy First**: Local processing when possible, encrypted transmission
4. **Adaptive Sampling**: Intelligent timing based on user patterns
5. **Multi-Modal Integration**: Combine subjective and objective measures

---

## Layer 1: Rapid Pulse Checks (5-Second Inputs)

### Purpose
Capture real-time subjective states throughout the day without disrupting workflow.

### Implementation Strategy
- **Frequency**: Every 2-3 hours, adaptively timed during natural breaks
- **Format**: Visual scales, emoji selection, single-tap interfaces
- **Trigger**: Smart notifications based on calendar events, app usage patterns

### Metrics

#### 1. Cognitive Clarity Index
**Collection Method**: 1-tap scale (Foggy → Sharp)
- 5-point visual scale with descriptive icons
- Gamified slider with haptic feedback

**Purpose**: Track mental fog patterns and attention clarity fluctuations

**Scoring**:
- 1: Severe brain fog, difficulty focusing
- 2: Noticeable fog, reduced sharpness
- 3: Moderate clarity, occasional lapses
- 4: Good clarity, sustained focus
- 5: Peak sharpness, optimal mental state

**Analysis Applications**:
- Identify daily clarity patterns
- Correlate with sleep quality, meal timing
- Predict afternoon crash likelihood

---

#### 2. Decision Fatigue Level
**Collection Method**: Binary choice speed test

**Test Design**:
```
Present two similar options (e.g., two images, two words)
Measure: Response time + decision confidence
Duration: 3-5 seconds
```

**Purpose**: Measure decision-making capacity depletion

**Metrics Captured**:
- Response latency (ms)
- Choice switching behavior
- Confidence self-rating (optional)

**Fatigue Indicators**:
- Increased response time (>500ms baseline increase)
- Indecision behaviors (hovering, switching)
- Lower confidence ratings

**Analysis Applications**:
- Detect decision fatigue accumulation
- Optimize meeting schedules
- Trigger decision delegation suggestions

---

#### 3. Attention Residue
**Collection Method**: Task-switching difficulty rating (1-5 scale)

**Prompt**: "How hard is it to focus on your current task?"
- Presented after app switches or context changes
- Visual scale: Easy flow → Mental barrier

**Purpose**: Identify context-switching cognitive costs

**Scoring**:
- 1: Smooth transition, immediate focus
- 2: Minor adjustment period
- 3: Noticeable effort required
- 4: Significant mental resistance
- 5: Unable to fully shift focus

**Analysis Applications**:
- Quantify multitasking costs
- Identify high-attention-residue activities
- Optimize task batching strategies

---

#### 4. Mental Energy Reserve
**Collection Method**: Visual fuel gauge selection (4x daily)

**Visual Design**: Battery/fuel tank metaphor
- Empty → Full (0-100%)
- Color-coded: Red (0-25%), Yellow (26-50%), Green (51-100%)

**Timing**: Morning, pre-lunch, afternoon, evening

**Purpose**: Monitor subjective energy depletion rate

**Analysis Applications**:
- Calculate daily energy depletion velocity
- Predict crash times
- Compare recovery efficiency
- Correlate with objective performance metrics

---

#### 5. Cognitive Load Perception
**Collection Method**: Pressure meter (Light → Overwhelming)

**Prompt**: "How much mental pressure are you under right now?"
- Presented during work blocks
- Visual pressure gauge interface

**Purpose**: Assess real-time processing burden

**Scoring Scale**:
- 1: Light cognitive load, spare capacity
- 2: Comfortable load, engaged
- 3: Moderate load, approaching capacity
- 4: Heavy load, near saturation
- 5: Overwhelming load, cognitive overload

**Analysis Applications**:
- Identify overload patterns
- Trigger break recommendations
- Correlate with error rates
- Optimize task scheduling

---

## Layer 2: Behavioral Biomarkers (Passive Collection)

### Purpose
Capture objective cognitive performance indicators without conscious user input.

### Privacy & Ethics
- All processing done on-device when possible
- Explicit user consent required
- Data anonymization for cloud analytics
- User control over all collection toggles

### Metrics

#### 1. Typing Dynamics

**Data Captured**:
- Keystroke velocity (characters per minute)
- Error rate (backspaces, autocorrect frequency)
- Pause duration between words
- Typing rhythm variability

**Fatigue Indicators**:
- ↓ 15% typing speed = mild fatigue
- ↑ 30% error rate = moderate fatigue
- ↑ 200ms average pause = attention lapses

**Technical Implementation**:
```python
# Pseudocode
typing_metrics = {
    'velocity': chars_per_minute,
    'error_rate': backspaces / total_keystrokes,
    'pause_mean': mean(inter_keystroke_intervals),
    'rhythm_variance': std(inter_keystroke_intervals)
}
```

**Analysis Applications**:
- Real-time fatigue detection
- Predictive alerts before errors spike
- Optimal break timing recommendations

---

#### 2. App Switching Velocity

**Data Captured**:
- App switch frequency (switches per hour)
- Dwell time in each app
- App category patterns (productivity vs entertainment)
- Return frequency to previous apps

**Fatigue Indicators**:
- ↑ 40% switch frequency = focus fragmentation
- ↓ average dwell time = attention instability
- ↑ entertainment app usage = mental escape behavior

**Analysis Applications**:
- Quantify digital distractibility
- Identify focus breakdown moments
- Correlate with self-reported clarity

---

#### 3. Scroll Behavior Analysis

**Data Captured**:
- Scroll velocity (pixels per second)
- Scroll acceleration patterns
- Dwell time on content
- Re-reading behavior (scroll-back frequency)

**Fatigue Indicators**:
- ↑ scroll speed + ↓ dwell time = shallow processing
- Erratic acceleration = attention fluctuation
- ↑ re-reading = comprehension difficulty

**Technical Implementation**:
```javascript
// Pseudocode
scroll_metrics = {
    velocity: scroll_distance / time,
    acceleration: velocity_changes,
    dwell_time: time_on_screen,
    reread_frequency: backward_scrolls / total_scrolls
}
```

---

#### 4. Response Latency Tracking

**Data Captured**:
- Time to respond to notifications
- Time to initiate app actions
- Delay in completing prompted tasks

**Baseline Establishment**: 2-week learning period

**Fatigue Indicators**:
- ↑ 25% response time vs baseline = processing slowdown
- Delayed notification interaction = reduced alertness

---

#### 5. Phone Pickup Frequency

**Data Captured**:
- Number of phone unlocks per hour
- Time spent per session
- Purpose patterns (notification check vs intentional use)

**Fatigue Indicators**:
- ↑ frequency + ↓ session duration = restless attention
- ↑ purposeless checking = self-regulation difficulty

---

#### 6. Reading Speed Variance

**Data Captured** (from in-app content):
- Words per minute
- Dwell time on complex sentences
- Re-reading frequency

**Fatigue Indicators**:
- ↓ 20% reading speed = comprehension difficulty
- ↑ dwell time on simple text = processing fatigue

---

#### 7. Voice Biomarkers (Optional)

**Data Captured**:
- Vocal pitch variability
- Speech pace (words per minute)
- Pause patterns and duration
- Vocal energy/amplitude

**Fatigue Indicators**:
- ↓ pitch variability = reduced emotional range (emotional fatigue)
- ↓ speech pace = processing slowdown
- ↑ pauses = word-finding difficulty
- ↓ vocal energy = physical-cognitive coupling

**Implementation**: Voice journal or voice-based assessments

---

## Layer 3: Cognitive Performance Micro-Tests

### Purpose
Objective measurement of specific cognitive domains through brief, validated assessments.

### Design Principles
- Duration: 30-60 seconds maximum
- Gamified interfaces to maintain engagement
- Adaptive difficulty based on baseline performance
- Validated against clinical assessments

### Test Battery

#### 1. Flanker Task (Selective Attention)

**Test Design**:
```
Present: →→→→→ or →→←→→
User responds: Center arrow direction
Measure: Accuracy + response time
Duration: 30 seconds, 20 trials
```

**Cognitive Domain**: Selective attention and inhibitory control

**Frequency**: 2x daily (morning + afternoon)

**Metrics**:
- Accuracy rate (% correct)
- Mean response time
- Congruent vs incongruent trial difference
- Accuracy degradation over trials

**Fatigue Indicators**:
- ↓ 10% accuracy = attention fatigue
- ↑ 150ms response time = processing slowdown
- ↑ congruency effect = reduced inhibitory control

---

#### 2. N-Back Sequence (Working Memory)

**Test Design**:
```
Present sequence: A, B, C, A, D...
User indicates: "Is current item same as N steps back?"
Adaptive N: Start at 2-back, adjust based on performance
Duration: 60 seconds
```

**Cognitive Domain**: Working memory capacity

**Frequency**: Daily (optimal time based on user patterns)

**Metrics**:
- Accuracy (hit rate - false alarm rate)
- Response time
- Maximum N-level achieved
- Performance decay rate

**Fatigue Indicators**:
- ↓ accuracy below 70% = memory fatigue
- ↓ maximum N-level = capacity reduction
- ↑ false alarms = impulsive responding (executive fatigue)

---

#### 3. Psychomotor Vigilance Test (Reaction Time & Alertness)

**Test Design**:
```
Screen: Wait for stimulus (random interval 2-10s)
Stimulus appears: Tap as fast as possible
Measure: Simple reaction time
Duration: 90 seconds, 8-10 trials
```

**Cognitive Domain**: Sustained attention and alertness

**Frequency**: 3x weekly (to avoid practice effects)

**Metrics**:
- Median reaction time
- Number of lapses (RT > 500ms)
- Fastest 10% trials (optimal alertness)
- Slowest 10% trials (vigilance failures)

**Fatigue Indicators**:
- ↑ median RT >30ms = alertness decline
- ≥2 lapses = vigilance fatigue
- ↑ RT variability = inconsistent attention

**Gold Standard**: Validated predictor of sleep deprivation and fatigue

---

#### 4. Stroop Test (Cognitive Flexibility)

**Test Design**:
```
Present: Color word in mismatched color (e.g., "BLUE" in red)
User responds: Ink color, not word
Measure: Accuracy + response time
Duration: 45 seconds
```

**Cognitive Domain**: Executive function and cognitive control

**Frequency**: 2x weekly

**Metrics**:
- Stroop interference score (incongruent RT - congruent RT)
- Error rate
- Response time variability

**Fatigue Indicators**:
- ↑ 100ms interference score = executive fatigue
- ↑ error rate >15% = control breakdown
- ↑ RT variability = unstable attention

---

#### 5. Pattern Completion (Processing Speed)

**Test Design**:
```
Present: Visual pattern with missing element
User selects: Correct completion from options
Measure: Accuracy + completion time
Duration: 60 seconds, 10 patterns
```

**Cognitive Domain**: Processing speed and pattern recognition

**Frequency**: Weekly

**Metrics**:
- Accuracy rate
- Mean completion time
- Performance on novel vs familiar patterns

**Fatigue Indicators**:
- ↑ 20% completion time = processing slowing
- ↓ accuracy on novel patterns = reduced fluid intelligence

---

## Layer 4: Contextual & Environmental Factors

### Purpose
Understand the "why" behind fatigue patterns by correlating performance with contextual variables.

### Data Integration Strategy
- API integrations with calendar, health apps, weather services
- User-provided tags and annotations
- Automated pattern recognition

### Categories

#### 1. Workload Factors

**Metrics**:
| Metric | Source | Collection Method |
|--------|--------|-------------------|
| Meeting duration & frequency | Calendar integration | Automatic via API |
| Email/message volume | Gmail/Outlook/Slack APIs | Automatic counting |
| Task complexity rating | User input | Quick tag after tasks |
| Deadline pressure | Calendar + user tags | Hybrid |
| Context switches | App monitoring | Passive tracking |

**Analysis Applications**:
- Correlate meeting load with afternoon fatigue
- Identify optimal meeting schedules
- Quantify "meeting recovery time"
- Predict email fatigue thresholds

---

#### 2. Biological Rhythms

**Metrics**:
| Metric | Source | Frequency |
|--------|--------|-----------|
| Sleep debt accumulation | Wearable + manual | Daily |
| Sleep quality score | Wearable integration | Nightly |
| Meal timing & quality | Quick logging | Per meal |
| Caffeine intake | Tap logging | Per consumption |
| Hydration tracking | Manual or smart bottle | Throughout day |
| Exercise timing & intensity | Wearable + manual | Per session |

**Analysis Applications**:
- Calculate sleep debt impact on cognitive performance
- Identify optimal caffeine timing
- Correlate meal timing with energy crashes
- Predict fatigue based on sleep quality

---

#### 3. Environmental Stressors

**Metrics**:
| Metric | Source | Method |
|--------|--------|--------|
| Ambient noise level | Device microphone (with permission) | Passive sampling |
| Light exposure | Device sensors + location | Automatic |
| Temperature comfort | Manual rating or smart home | Hybrid |
| Air quality index | Location-based APIs | Automatic |
| Weather conditions | Weather API | Automatic |

**Analysis Applications**:
- Identify environmental cognitive drains
- Suggest environmental optimizations
- Correlate weather with mood/energy patterns

---

#### 4. Emotional Context

**Metrics**:
| Metric | Collection Method | Frequency |
|--------|------------------|-----------|
| Stress perception (1-10) | Quick slider | 3x daily |
| Mood state | Circumplex model emoji | 4x daily |
| Social interaction quality | Post-interaction rating | After meetings/calls |
| Conflict/tension events | Event tagging | As needed |
| Positive experience logging | Gratitude quick-add | Optional |

**Analysis Applications**:
- Separate emotional fatigue from cognitive fatigue
- Identify stress-performance relationships
- Track emotional regulation capacity

---

#### 5. Cognitive Demands

**Metrics**:
| Metric | Collection Method | Purpose |
|--------|------------------|---------|
| Deep work vs shallow tasks | Activity categorization | Cognitive load quantification |
| Creative vs analytical work | Task type tagging | Domain-specific fatigue tracking |
| Learning new vs routine | Novelty rating | Cognitive investment measurement |
| Multitasking intensity | App switching + user rating | Attention fragmentation index |

**Analysis Applications**:
- Calculate "cognitive budget" expenditure
- Optimize task sequencing
- Identify sustainable workload patterns

---

## Data Collection Frequency & Timing

### Adaptive Sampling Algorithm

```python
# Pseudocode for smart sampling
def determine_assessment_timing(user_context):
    base_schedule = [9am, 12pm, 3pm, 6pm]

    # Adjust based on user patterns
    if user.chronotype == "night_owl":
        base_schedule = [time + 2_hours for time in base_schedule]

    # Increase frequency during high-fatigue periods
    if user.current_fatigue > 70:
        add_checkpoint(current_time + 30_minutes)

    # Respect focus blocks (no interruptions)
    if user.in_deep_work_session():
        delay_until_natural_break()

    # Context-aware triggers
    if user.just_finished_meeting():
        prompt_assessment(delay=2_minutes)

    return optimized_schedule
```

### Sampling Schedule

| Layer | Frequency | Timing Strategy |
|-------|-----------|----------------|
| **Rapid Pulse Checks** | 4-6x daily | Adaptive to user routine |
| **Behavioral Biomarkers** | Continuous passive | Real-time monitoring |
| **Cognitive Micro-Tests** | 2-3x daily | Morning, afternoon, optional evening |
| **Contextual Factors** | Event-driven | Automated + manual logging |

---

## Privacy & Data Security

### Collection Principles

1. **Explicit Consent**: Granular opt-in for each data type
2. **Local-First Processing**: Analysis on-device when possible
3. **Minimal Data Transmission**: Only aggregate metrics sent to cloud
4. **User Control**: Easy disable/delete for any metric
5. **Transparency**: Clear explanation of how each metric is used

### Data Flow Architecture

```
[Device Collection]
       ↓
[Local Processing & Analysis]
       ↓
[Encrypted Aggregation]
       ↓
[Cloud ML Models] ← Only anonymized patterns
       ↓
[Personalized Insights] → Back to device
```

---

## Validation & Calibration

### Baseline Establishment
- **Duration**: 14 days minimum
- **Purpose**: Establish personal norms for all metrics
- **Adaptive Recalibration**: Quarterly baseline updates

### Scientific Validation
- Correlation with validated fatigue scales (MFI-20, SOFI)
- Clinical study partnerships
- Continuous A/B testing of intervention effectiveness

---

## Competitive Differentiation Summary

### What Makes This Framework Unique

| Feature | Our Approach | Typical Competitors |
|---------|-------------|---------------------|
| **Data Depth** | 4-layer multi-modal system | Single-layer questionnaires |
| **Objectivity** | Behavioral biomarkers + cognitive tests | Self-report only |
| **Granularity** | Sub-hourly tracking | Once daily |
| **Scientific Rigor** | Validated cognitive assessments | Generic mood scales |
| **Passive Collection** | 60% passive, 40% active | 90% active input required |
| **Contextual Intelligence** | Environmental + situational correlation | Isolated metrics |
| **Personalization** | Individual baseline + adaptive | One-size-fits-all |

---

**Next**: See `assessment-engine.md` for how these metrics are transformed into actionable insights.

---

**Version**: 1.0
**Last Updated**: 2025-11-05
