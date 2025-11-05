# Assessment & Prediction Engine

## Overview

This document details how collected metrics are transformed into actionable insights through our multi-stage assessment and prediction system. Our engine goes beyond simple scoring to provide fatigue phenotype identification, multi-system analysis, and predictive analytics.

---

## Part 1: Fatigue Scoring System

### Composite Fatigue Score (0-100)

A weighted combination of objective and subjective measures providing a holistic fatigue assessment.

#### Scoring Algorithm

```python
# Pseudocode for fatigue score calculation
def calculate_fatigue_score(user_data):
    # Subjective components (40% weight)
    subjective_score = weighted_average([
        user_data.cognitive_clarity * 0.25,
        user_data.mental_energy * 0.30,
        user_data.cognitive_load * 0.25,
        user_data.stress_level * 0.20
    ])

    # Objective behavioral markers (35% weight)
    behavioral_score = weighted_average([
        user_data.typing_performance * 0.30,
        user_data.attention_stability * 0.25,
        user_data.response_latency * 0.25,
        user_data.app_switching_pattern * 0.20
    ])

    # Cognitive test performance (25% weight)
    cognitive_score = weighted_average([
        user_data.flanker_performance * 0.25,
        user_data.nback_accuracy * 0.30,
        user_data.pvt_reaction_time * 0.25,
        user_data.stroop_interference * 0.20
    ])

    # Composite score
    fatigue_score = (
        subjective_score * 0.40 +
        behavioral_score * 0.35 +
        cognitive_score * 0.25
    )

    # Normalize to 0-100 (0 = no fatigue, 100 = extreme fatigue)
    return normalize(fatigue_score, 0, 100)
```

#### Score Interpretation

| Score Range | Level | Visual Indicator | User Message |
|-------------|-------|------------------|--------------|
| **0-30** | Optimal | 🟢 Green | "Peak performance - tackle complex tasks" |
| **31-50** | Moderate | 🟡 Yellow | "Good energy - sustained focus possible" |
| **51-70** | Elevated | 🟠 Orange | "Fatigue building - consider a break" |
| **71-85** | High | 🔴 Red | "Significant fatigue - recovery needed" |
| **86-100** | Critical | ⚫ Dark Red | "Critical fatigue - stop and restore" |

---

## Part 2: Fatigue Phenotype Identification

### Purpose
Classify users into distinct fatigue patterns to enable personalized interventions.

### Phenotype Profiles

#### 1. "The Cliff Diver"

**Pattern Characteristics**:
- Morning scores: 20-35 (excellent)
- Gradual increase until ~2-3 PM
- Sharp spike: +30-40 points in 1-2 hours
- Evening partial recovery

**Detection Algorithm**:
```python
def detect_cliff_diver(daily_scores):
    morning_avg = mean(scores[6:12])
    afternoon_change = max_hourly_increase(scores[12:16])

    if morning_avg < 35 and afternoon_change > 25:
        return "CLIFF_DIVER"
```

**Prevalence**: ~35% of users

**Needs**:
- Strategic energy management
- Pre-scheduled afternoon recovery
- Complex task front-loading
- Preventive interventions at 1 PM

**Interventions**:
- "Power Hour Protocol": 90-min deep work morning block
- Preventive break at 1:30 PM (before crash)
- Afternoon task simplification
- Strategic caffeine timing (avoid post-2 PM)

---

#### 2. "The Slow Burner"

**Pattern Characteristics**:
- Morning scores: 40-50 (moderate)
- Linear steady increase throughout day
- +3-5 points per hour
- No dramatic spikes
- Poor recovery between days

**Detection Algorithm**:
```python
def detect_slow_burner(daily_scores):
    slope = calculate_trend_slope(scores)
    variance = calculate_variance(hourly_changes)

    if slope > 3 and slope < 6 and variance < 5:
        return "SLOW_BURNER"
```

**Prevalence**: ~25% of users

**Needs**:
- Frequent micro-recoveries
- Consistent sleep schedule
- Gradual task complexity reduction
- Enhanced weekend recovery

**Interventions**:
- 5-minute breaks every 60 minutes
- Midday energy reset (15-minute protocol)
- Progressive task difficulty scheduling
- Sleep extension recommendations

---

#### 3. "The Rollercoaster"

**Pattern Characteristics**:
- Highly variable scores (±20 points within hours)
- Unpredictable peaks and valleys
- High standard deviation
- Context-sensitive fluctuations

**Detection Algorithm**:
```python
def detect_rollercoaster(daily_scores):
    std_dev = calculate_std_dev(scores)
    num_reversals = count_trend_reversals(scores)

    if std_dev > 15 and num_reversals > 4:
        return "ROLLERCOASTER"
```

**Prevalence**: ~20% of users

**Needs**:
- Stabilization strategies
- Trigger identification (what causes spikes?)
- Emotional regulation support
- Routine establishment

**Interventions**:
- Pattern recognition AI: "Your energy spikes after walks"
- Stability routines (consistent meal times, breaks)
- Emotional state tracking integration
- Pre-emptive alerts before typical dips

---

#### 4. "The Night Owl Struggler"

**Pattern Characteristics**:
- Morning scores: 60-75 (high fatigue)
- Gradual improvement throughout day
- Evening scores: 30-45 (optimal)
- Chronotype mismatch with schedule

**Detection Algorithm**:
```python
def detect_night_owl(daily_scores):
    morning_avg = mean(scores[6:10])
    evening_avg = mean(scores[18:22])

    if morning_avg > 60 and evening_avg < 45:
        return "NIGHT_OWL_STRUGGLER"
```

**Prevalence**: ~12% of users

**Needs**:
- Chronotype optimization
- Schedule flexibility advocacy
- Morning cognitive support
- Evening productivity maximization

**Interventions**:
- Morning activation protocols (light exposure, movement)
- Schedule important tasks for afternoon/evening
- Gradual circadian adjustment plans
- Workplace flexibility recommendations

---

#### 5. "The Sprinter"

**Pattern Characteristics**:
- Intense focus periods: scores 15-25
- Rapid burnout: spike to 70+ after 2-3 hours
- Long recovery periods required
- Boom-bust cycle

**Detection Algorithm**:
```python
def detect_sprinter(session_data):
    intense_periods = identify_low_fatigue_blocks(scores)
    post_intensity_spike = measure_spike_after_intense()

    if len(intense_periods) > 0 and post_intensity_spike > 35:
        return "SPRINTER"
```

**Prevalence**: ~8% of users

**Needs**:
- Recovery protocol optimization
- Sustainable pacing strategies
- Break enforcement
- Energy reserve monitoring

**Interventions**:
- Forced breaks during intense periods
- "Energy bank" visualization
- Sprint duration optimization (find personal sweet spot)
- Enhanced recovery protocols

---

## Part 3: Multi-System Fatigue Assessment

### Purpose
Distinguish between different types of fatigue to provide targeted interventions.

### Fatigue Systems

#### 1. Executive Fatigue

**Indicators**:
- ↓ Stroop test performance
- ↑ Decision fatigue scores
- ↑ Task-switching difficulty
- ↓ Planning quality (self-reported)

**Assessment Method**:
```python
executive_fatigue = calculate_score([
    (100 - stroop_performance) * 0.30,
    decision_latency_increase * 0.25,
    attention_residue_rating * 0.25,
    self_reported_organization * 0.20
])
```

**Symptoms**:
- Poor planning and disorganization
- Impulsive decisions
- Difficulty with complex tasks
- Reduced cognitive flexibility

**Specific Interventions**:
- Decision templates and pre-commitments
- Planning offload (write down next steps)
- Single-tasking enforcement
- Executive function recovery exercises

---

#### 2. Emotional Fatigue

**Indicators**:
- ↓ Emotional range (voice biomarkers)
- ↑ Irritability (self-reported)
- ↓ Social interaction quality ratings
- ↑ Withdrawal behaviors

**Assessment Method**:
```python
emotional_fatigue = calculate_score([
    (100 - voice_pitch_variability) * 0.25,
    irritability_rating * 0.30,
    (100 - social_quality_scores) * 0.25,
    withdrawal_frequency * 0.20
])
```

**Symptoms**:
- Irritability and short temper
- Emotional numbness or apathy
- Reduced empathy
- Social withdrawal

**Specific Interventions**:
- Emotional regulation exercises
- Social break recommendations
- Gratitude/positive event logging
- Connection prompts (reach out to friend)

---

#### 3. Social Fatigue

**Indicators**:
- ↑ Meeting fatigue accumulation
- ↓ Post-interaction energy
- ↑ Desire for solitude
- ↓ Communication quality

**Assessment Method**:
```python
social_fatigue = calculate_score([
    meeting_load_index * 0.35,
    post_social_energy_drop * 0.30,
    social_avoidance_behaviors * 0.20,
    communication_quality_decline * 0.15
])
```

**Symptoms**:
- Dread before meetings
- Exhaustion after social interaction
- Reduced communication quality
- Desire for isolation

**Specific Interventions**:
- Meeting-free blocks
- Async communication promotion
- Social battery visualization
- Recovery time between interactions

---

#### 4. Creative Fatigue

**Indicators**:
- ↓ Divergent thinking test scores
- ↑ Rigid thinking patterns
- ↓ Novel idea generation
- ↑ Reliance on familiar solutions

**Assessment Method**:
- Periodic divergent thinking micro-tests
- Self-reported creative blocks
- Novel vs routine task ratio

**Symptoms**:
- Lack of inspiration
- Rigid, conventional thinking
- Difficulty with brainstorming
- Reduced curiosity

**Specific Interventions**:
- Creative reset activities (doodling, random word association)
- Environmental changes
- Cross-domain inspiration prompts
- Incubation period recommendations

---

#### 5. Physical-Cognitive Coupling

**Indicators**:
- Correlation between physical tiredness and mental performance
- Sleep debt impact on cognitive scores
- Exercise recovery patterns

**Assessment Method**:
- Correlation analysis between wearable data and cognitive tests
- Sleep quality → next-day performance regression

**Key Insight**: Some users have high coupling (physical rest crucial), others have lower coupling

**Interventions**:
- For high-coupling users: Emphasize sleep, movement breaks
- For low-coupling users: Can push cognitive work despite physical tiredness (but monitor)

---

## Part 4: Predictive Analytics Engine

### Short-Term Predictions (Next 4 Hours)

#### 1. Fatigue Onset Probability

**Method**: Machine learning model trained on user's historical patterns

**Inputs**:
- Current fatigue score
- Time of day
- Recent fatigue velocity
- Upcoming calendar events
- Sleep quality from last night
- Meal timing

**Output**:
```
Fatigue Forecast (Next 4 Hours)
────────────────────────────────
12 PM: 45 (moderate) ━━━━━━░░░░
1 PM:  52 (elevated) ━━━━━━━░░░
2 PM:  67 (high) ⚠️   ━━━━━━━━━░
3 PM:  58 (elevated) ━━━━━━━━░░

Alert: Crash likely at 2 PM (78% confidence)
Suggestion: Schedule break at 1:30 PM
```

**Accuracy Target**: >75% within ±10 points

---

#### 2. Optimal Break Timing

**Algorithm**:
```python
def predict_optimal_break_time(user_state):
    fatigue_trajectory = predict_next_4_hours()
    crash_time = identify_steepest_increase(fatigue_trajectory)
    optimal_break = crash_time - 30_minutes

    return {
        'break_time': optimal_break,
        'recommended_duration': calculate_needed_recovery(),
        'break_type': select_intervention(user_state)
    }
```

**Personalization**: Learns individual break effectiveness patterns

---

#### 3. Performance Decline Trajectory

**Visualization**:
```
Current Cognitive Capacity
━━━━━━━━━━━━━━━━━━━━━━━━━━
Now:     ████████░░ 80%
+1 hour: ██████░░░░ 60%
+2 hours: ████░░░░░░ 40%
+3 hours: ██░░░░░░░░ 20% ⚠️

Warning: Complex task capacity dropping rapidly
Recommend: Tackle high-priority items now
```

---

#### 4. Recovery Time Estimation

**Method**: Based on current fatigue level and historical recovery patterns

**Formula**:
```python
def estimate_recovery_time(current_fatigue, user_profile):
    base_recovery = current_fatigue * user_profile.recovery_coefficient
    contextual_adjustments = adjust_for_context()

    return {
        'passive_recovery': base_recovery,  # Just rest
        'active_recovery': base_recovery * 0.6,  # With interventions
        'complete_recovery': base_recovery * 1.5  # To baseline
    }
```

**Example Output**:
```
Recovery Estimate (Current Fatigue: 72)
────────────────────────────────────────
Passive rest: 35 minutes
Active protocol: 20 minutes
Full restoration: 50 minutes
```

---

### Medium-Term Predictions (Next 7 Days)

#### 1. Cumulative Fatigue Debt

**Concept**: Fatigue that accumulates when daily recovery is insufficient

**Calculation**:
```python
def calculate_fatigue_debt(week_data):
    daily_debt = []
    for day in week_data:
        peak_fatigue = max(day.scores)
        recovery_achieved = baseline - min(day.evening_scores)
        daily_debt.append(peak_fatigue - recovery_achieved)

    cumulative_debt = sum(daily_debt)
    return cumulative_debt
```

**Visualization**:
```
Weekly Fatigue Debt Accumulation
────────────────────────────────
Mon: +12 ████
Tue: +15 █████
Wed: +18 ██████
Thu: +22 ███████  ⚠️ Debt building
Fri: +8  ███
Sat: -5  Recovery
Sun: -15 █████ Recovery

Net Debt: +55 (Moderate risk)
Recommendation: Prioritize rest this weekend
```

---

#### 2. Burnout Risk Score

**Multi-Factor Assessment**:

**Risk Factors**:
1. Sustained high fatigue (>60 for 5+ consecutive days)
2. Insufficient weekend recovery
3. Declining cognitive test performance trend
4. Emotional fatigue indicators
5. Sleep debt accumulation
6. Increased irritability/withdrawal

**Scoring Algorithm**:
```python
def calculate_burnout_risk(user_data):
    chronic_fatigue = sustained_high_scores(user_data, threshold=60, days=5)
    recovery_deficit = weekend_recovery_inadequacy()
    performance_decline = cognitive_test_trend(weeks=4)
    emotional_signals = emotional_fatigue_markers()
    sleep_debt = calculate_sleep_debt(weeks=2)

    risk_score = weighted_average([
        chronic_fatigue * 0.30,
        recovery_deficit * 0.25,
        performance_decline * 0.20,
        emotional_signals * 0.15,
        sleep_debt * 0.10
    ])

    return normalize(risk_score, 0, 100)
```

**Risk Levels**:
| Score | Level | Action |
|-------|-------|--------|
| 0-30 | Low | Continue current patterns |
| 31-50 | Moderate | Implement preventive measures |
| 51-70 | High | Urgent intervention needed |
| 71-100 | Critical | Professional help recommended |

**Early Warning System**:
```
⚠️ Burnout Risk Alert
────────────────────────────────
Current Score: 58/100 (High Risk)
Trend: ↑ Increasing

Red Flags Detected:
• 6 consecutive days with fatigue >65
• Cognitive scores down 18% vs baseline
• Weekend recovery insufficient (3 weeks)

Recommended Actions:
1. Schedule 3-day break (urgent)
2. Reduce meeting load 40%
3. Delegate non-essential tasks
4. Consider professional consultation
```

---

#### 3. Weekly Performance Forecast

**Prediction**:
```
Week Ahead Performance Forecast
────────────────────────────────
Monday:    ████████░░ 75% (Good start)
Tuesday:   ██████░░░░ 60% (Moderate)
Wednesday: ████░░░░░░ 40% (Challenging) ⚠️
Thursday:  ██████░░░░ 55% (Recovering)
Friday:    ████████░░ 70% (Strong finish)

Based on: Upcoming calendar, typical weekly pattern, current fatigue debt

Optimization Tip: Move complex tasks to Monday/Friday
```

---

#### 4. Optimal Task Scheduling

**AI-Powered Recommendations**:

**Analysis**:
- Historical performance patterns by time/day
- Task type effectiveness windows
- Meeting impact on subsequent performance
- Personal chronotype alignment

**Output**:
```
Personalized Peak Performance Windows
────────────────────────────────────────
Deep Work: Mon-Fri 9:00-11:30 AM
Creative Tasks: Tue/Thu 2:00-4:00 PM
Routine Tasks: Daily 11:30-12:30 PM
Meetings: Tue/Wed/Thu 10:00 AM - 3:00 PM
Learning: Mon/Wed 4:00-5:30 PM

Avoid:
• Complex decisions after 4 PM
• Back-to-back meetings >2 hours
• Deep work on Friday afternoons
```

---

### Long-Term Predictions (30+ Days)

#### 1. Chronic Fatigue Development Risk

**Machine Learning Model**:
- Trained on longitudinal user data
- Identifies patterns leading to chronic fatigue
- Predictive features: sleep variability, stress trends, recovery inadequacy

**Warning System**:
```
30-Day Chronic Fatigue Risk
────────────────────────────
Current Trajectory: 67% risk

Warning Signals:
• Sleep debt increasing (6 of 8 weeks)
• Average fatigue score trending up (+12 points)
• Recovery time increasing (+25% vs 3 months ago)

Intervention Window: Next 2 weeks critical
```

---

#### 2. Seasonal Pattern Identification

**Analysis**:
- Multi-year data correlation
- Seasonal affective patterns
- Environmental factor impacts

**Insights**:
```
Your Seasonal Fatigue Profile
────────────────────────────────
Winter (Dec-Feb): +18% baseline fatigue
Spring (Mar-May): Optimal performance
Summer (Jun-Aug): +8% fatigue (heat sensitivity)
Fall (Sep-Nov): -5% fatigue (peak season)

Preparation: Winter coping strategies needed (light therapy, vitamin D)
```

---

#### 3. Career Sustainability Index

**Purpose**: Assess long-term viability of current work patterns

**Metrics**:
- Average weekly fatigue scores
- Recovery-to-demand ratio
- Burnout risk trend
- Satisfaction vs fatigue correlation

**Scoring**:
```python
sustainability_index = calculate([
    workload_recovery_balance * 0.30,
    burnout_trajectory * 0.25,
    weekend_recovery_adequacy * 0.20,
    job_satisfaction_vs_fatigue * 0.15,
    long_term_performance_trend * 0.10
])
```

**Output**:
```
Career Sustainability Assessment
────────────────────────────────────
Overall Index: 58/100 (Concerning)

Analysis:
✓ Performance maintained short-term
✗ Insufficient recovery patterns
✗ Increasing reliance on weekends for recovery
⚠️ Current pace not sustainable >12 months

Recommendations:
• Negotiate workload reduction
• Implement mandatory recovery protocols
• Consider role/environment changes
```

---

#### 4. Health Impact Projections

**Based on Research Correlations**:
- Chronic stress → cardiovascular risk
- Sleep debt → immune function
- Cognitive fatigue → mental health

**Projections** (educational, not diagnostic):
```
Projected Health Impact (Current Patterns)
───────────────────────────────────────────
Sleep Quality Trajectory: ↓ Declining
Stress Exposure: ↑ Elevated
Recovery Adequacy: ↓ Insufficient

If Continued 6 Months:
• Sleep disorder risk: +35%
• Anxiety/depression risk: +28%
• Cognitive performance: -15-20%

Note: Consult healthcare provider for personalized assessment
```

---

## Part 5: Personalization & Learning

### Baseline Calibration

**Initial Learning Period**: 14 days

**Calibrated Metrics**:
- Personal fatigue thresholds
- Typical daily patterns
- Recovery rates
- Intervention effectiveness

**Recalibration**:
- Automatic quarterly adjustments
- Manual reset option if major life changes

---

### Adaptive Prediction Models

**Continuous Learning**:
```python
def update_prediction_model(user_feedback):
    # User confirms or corrects prediction
    actual_outcome = user_feedback.actual_fatigue
    predicted_outcome = user_feedback.predicted_fatigue

    model_error = calculate_error(actual, predicted)
    update_weights(model, model_error)

    # Improve future predictions
    retrain_model(user_data, updated_weights)
```

**User Feedback Loop**:
- "Was this prediction accurate?" prompts
- Automatic outcome tracking
- Model improvement over time

---

### Individual Response Profiling

**What We Learn**:
1. **Intervention Effectiveness**: Which recovery methods work best for this user?
2. **Trigger Sensitivity**: What causes their fatigue spikes?
3. **Resilience Factors**: What protects them from fatigue?
4. **Optimal Patterns**: What schedules work best?

**Application**:
- Prioritize most effective interventions
- Avoid ineffective recommendations
- Customize prevention strategies

---

## Part 6: Validation & Accuracy

### Prediction Accuracy Metrics

**Tracked Performance Indicators**:
```python
prediction_accuracy = {
    '4-hour_forecast': target_accuracy >= 0.75,  # ±10 points
    '1-day_forecast': target_accuracy >= 0.70,   # ±15 points
    '7-day_trends': target_accuracy >= 0.65,     # Direction correct
    'burnout_risk': target_sensitivity >= 0.80,  # Catch high-risk cases
    'intervention_success': target_effectiveness >= 0.60
}
```

### Continuous Validation

**Methods**:
1. User outcome reporting
2. A/B testing of interventions
3. Comparison with validated scales (MFI-20, SOFI)
4. Clinical study partnerships

---

## Summary: What We Assess, Track & Predict

### We ASSESS:
✓ Real-time fatigue scores (composite + domain-specific)
✓ Fatigue phenotype classification
✓ Multi-system fatigue breakdown
✓ Current cognitive capacity

### We TRACK:
✓ Daily fatigue patterns and trends
✓ Fatigue debt accumulation
✓ Recovery effectiveness
✓ Intervention response patterns
✓ Long-term sustainability metrics

### We PREDICT:
✓ Short-term: Next 4-hour fatigue trajectory
✓ Medium-term: Weekly performance forecast
✓ Long-term: Burnout risk, seasonal patterns
✓ Optimal: Task scheduling, break timing, recovery needs

### We DIFFERENTIATE Through:
✓ Multi-modal objective + subjective assessment
✓ Phenotype-specific personalization
✓ Predictive analytics (not just reactive tracking)
✓ Domain-specific fatigue separation
✓ Longitudinal pattern learning
✓ Evidence-based intervention matching

---

**Next**: See `feedback-system.md` for how these assessments are communicated to users, and `suggestion-engine.md` for personalized intervention recommendations.

---

**Version**: 1.0
**Last Updated**: 2025-11-05
