/* ================================================================
   OFFICE RELAX - 30 Min Daily Workout
   Static web app for office worker mobility & posture reset
   ================================================================ */

// ── AUDIO ENGINE (Web Audio API beeps) ──────────────────────────
class AudioEngine {
  constructor() {
    this.ctx = null;
  }

  _ensure() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  beep(freq = 800, duration = 0.15, type = 'sine') {
    try {
      this._ensure();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) { /* silent fail */ }
  }

  countdown() { this.beep(1000, 0.1); }
  exerciseEnd() { this.beep(600, 0.3, 'triangle'); }
  phaseChange() { this.beep(500, 0.2); this.beep(800, 0.2); }
  complete() {
    this.beep(523, 0.2);
    setTimeout(() => this.beep(659, 0.2), 200);
    setTimeout(() => this.beep(784, 0.3), 400);
  }
}

// ── EXERCISE DEFINITIONS ────────────────────────────────────────
const EXERCISES = {
  /* ---------- WARM-UP ---------- */
  'cat-cow': {
    id: 'cat-cow',
    name: 'Cat-Cow',
    videoId: 'WHUevrqeKIg',
    phase: 'warmup',
    duration: 90,
    reps: 10,
    type: 'rep',
    pose: 'all-fours',
    movement: 'spine-wave',
    target: 'Spine, Back, Core',
    instructions: [
      'Start on all fours: hands under shoulders, knees under hips',
      'Inhale: arch back, lift head, push hips back (Cow)',
      'Exhale: round spine toward ceiling, tuck chin, pull navel in (Cat)',
      'Move slowly with your breath'
    ]
  },
  'glute-bridge': {
    id: 'glute-bridge',
    name: 'Glute Bridge',
    videoId: 'R1OXPHRqehw',
    phase: 'warmup',
    duration: 90,
    reps: 12,
    type: 'rep',
    pose: 'lying-supine',
    movement: 'hip-lift',
    target: 'Glutes, Core, Hamstrings',
    instructions: [
      'Lie on back, knees bent, feet flat hip-width apart',
      'Squeeze glutes → lift hips until body forms straight line from shoulders to knees',
      'Hold peak 2 seconds — squeeze glutes hard',
      'Lower slowly and repeat'
    ]
  },
  'dead-bug': {
    id: 'dead-bug',
    name: 'Dead Bug',
    videoId: 'xtTIb6dC-vI',
    phase: 'warmup',
    duration: 90,
    reps: 8,
    type: 'rep-each-side',
    pose: 'lying-supine',
    movement: 'contralateral',
    target: 'Deep Core, Transversus abdominis',
    instructions: [
      'Lie on back, arms extended toward ceiling, knees bent 90° (feet off floor)',
      'Keep lower back PRESSED into floor — do not arch',
      'Extend right arm back + left leg straight forward',
      'Return to center → switch sides. Alternate smoothly'
    ]
  },

  /* ---------- STRENGTHENING ---------- */
  'single-leg-bridge': {
    id: 'single-leg-bridge',
    name: 'Single-Leg Bridge',
    videoId: '2sg3vqnE8qE',
    phase: 'strengthening',
    duration: 60,
    reps: 10,
    type: 'rep-each-side',
    pose: 'lying-supine',
    movement: 'hip-lift-single',
    target: 'Gluteus maximus, Hamstrings',
    instructions: [
      'Lie on back, one knee bent, other leg extended straight',
      'Squeeze glutes → lift hips, keep hips level (no tilting)',
      'Hold peak 2 seconds, lower slowly',
      'Complete reps on one side then switch legs'
    ]
  },
  'clamshell': {
    id: 'clamshell',
    name: 'Clamshell',
    videoId: 'lp-VUWbFrYg',
    phase: 'strengthening',
    duration: 50,
    reps: 15,
    type: 'rep-each-side',
    pose: 'side-lying',
    movement: 'hip-abduction',
    target: 'Gluteus medius (side glutes)',
    instructions: [
      'Lie on side, knees bent 45°, legs stacked',
      'Keep heels together → open top knee like a clamshell',
      'Do not rotate hips — keep hips perpendicular to floor',
      'Lower slowly. Squeeze glutes at the top'
    ]
  },
  'prone-y': {
    id: 'prone-y',
    name: 'Prone Y Raise',
    videoId: 'E5Mj7LCvmmE',
    phase: 'strengthening',
    duration: 40,
    reps: 10,
    type: 'rep',
    pose: 'prone',
    movement: 'scapular-retraction',
    target: 'Lower traps, Rhomboids (mid-back)',
    instructions: [
      'Lie face down, forehead on floor, arms extended in Y shape',
      'Slowly lift chest and arms a few inches off floor',
      'Squeeze shoulder blades together at top, hold 2 seconds',
      'Lower with control — no momentum'
    ]
  },
  'chin-tuck': {
    id: 'chin-tuck',
    name: 'Chin Tuck',
    videoId: 'HBjR_xEYd-4',
    phase: 'strengthening',
    duration: 30,
    reps: 10,
    type: 'rep',
    pose: 'standing',
    movement: 'cervical-retraction',
    target: 'Deep neck flexors',
    instructions: [
      'Stand or sit with straight back',
      'Tuck chin back creating a "double-chin", eyes forward',
      'Hold 3 seconds — feel stretch at back of neck',
      'Release. Do not tilt head down'
    ]
  },
  'bird-dog': {
    id: 'bird-dog',
    name: 'Bird Dog',
    videoId: 'xEDnlOxeJH4',
    phase: 'strengthening',
    duration: 50,
    reps: 6,
    type: 'rep-each-side',
    pose: 'all-fours',
    movement: 'contralateral-extend',
    target: 'Core, Glutes, Shoulder stability',
    instructions: [
      'Start on all fours, back flat, core engaged',
      'Extend right arm forward + left leg back',
      'Hold 3 seconds — do NOT tilt hips or rotate torso',
      'Return to center → switch sides. Slow and controlled'
    ]
  },

  /* ---------- STRETCHING ---------- */
  'hip-flexor-stretch': {
    id: 'hip-flexor-stretch',
    name: 'Hip Flexor Stretch',
    videoId: '_vrztIsfMvM',
    phase: 'stretching',
    duration: 90,
    reps: null,
    type: 'hold',
    pose: 'half-kneeling',
    movement: 'static-hold',
    target: 'Iliopsoas, Rectus femoris',
    instructions: [
      'Kneel on one knee, other foot forward with knee at 90°',
      'Squeeze glute on kneeling side → push hips forward',
      'Feel stretch in front of thigh on kneeling side',
      'Hold 30-45 sec each side. Breathe steadily, do not hold breath'
    ]
  },
  'hamstring-stretch': {
    id: 'hamstring-stretch',
    name: 'Hamstring Stretch',
    videoId: 'iPD_nUSdJ6o',
    phase: 'stretching',
    duration: 90,
    reps: null,
    type: 'hold',
    pose: 'seated',
    movement: 'static-hold',
    target: 'Hamstrings (back of thighs)',
    instructions: [
      'Sit with one leg extended straight, other foot against inner thigh',
      'Slowly fold forward toward extended leg, keep back straight',
      'Feel stretch in back of thigh — not pain',
      'Hold 30-45 sec each side, breathe deeply'
    ]
  },
  'pec-stretch': {
    id: 'pec-stretch',
    name: 'Doorway Pec Stretch',
    videoId: 'h4M4XmCBFd8',
    phase: 'stretching',
    duration: 60,
    reps: null,
    type: 'hold',
    pose: 'standing',
    movement: 'static-hold',
    target: 'Pectoralis major & minor',
    instructions: [
      'Stand in doorway, hands on frame at shoulder height',
      'Step one foot forward, keep torso upright',
      'Feel stretch across chest and front of shoulders',
      'Hold 45 sec, breathe deeply'
    ]
  },
  'upper-trap-stretch': {
    id: 'upper-trap-stretch',
    name: 'Upper Trap Stretch',
    videoId: '-r0eoFS7_5Q',
    phase: 'stretching',
    duration: 60,
    reps: null,
    type: 'hold',
    pose: 'standing',
    movement: 'static-hold',
    target: 'Upper trapezius, Levator scapulae',
    instructions: [
      'Sit tall, right hand gripping chair edge for anchor',
      'Tilt head left, gently pull with left hand',
      'Feel stretch on right side of neck and shoulder',
      'Hold 30 sec each side. No bouncing or jerking'
    ]
  },
  'downward-dog': {
    id: 'downward-dog',
    name: 'Downward-Facing Dog',
    videoId: 'YqOqM79McYY',
    phase: 'stretching',
    duration: 60,
    reps: null,
    type: 'hold',
    pose: 'inverted',
    movement: 'static-hold',
    target: 'Full posterior chain, Calves, Shoulders',
    instructions: [
      'Start on all fours',
      'Push hips up high, straighten legs as much as possible',
      'Press hands into floor, relax head between arms',
      'Hold 45-60 sec. Pedal heels alternately if tight'
    ]
  },
  'childs-pose': {
    id: 'childs-pose',
    name: "Child's Pose",
    videoId: 'Y8oxXUwAxks',
    phase: 'stretching',
    duration: 120,
    reps: null,
    type: 'hold',
    pose: 'kneeling',
    movement: 'static-hold',
    target: 'Lower back, Hips, Shoulders',
    instructions: [
      'Kneel on floor, knees hip-width apart',
      'Fold forward, forehead to floor, arms extended forward',
      'Breathe deeply, relax entire body',
      'Hold 90 sec. Feel back and hips release completely'
    ]
  },

  /* ---------- NEURAL RESET ---------- */
  'wall-angel': {
    id: 'wall-angel',
    name: 'Wall Angel',
    videoId: 'cvx06snMQ3A',
    phase: 'neural',
    duration: 90,
    reps: 10,
    type: 'rep',
    pose: 'standing',
    movement: 'scapular-glide',
    target: 'Lower traps, Thoracic spine, Posture',
    instructions: [
      'Stand against wall: heels-glutes-shoulders-head touching wall',
      'Bend elbows 90°, backs of hands against wall at shoulder height',
      'Slide arms up wall, keeping elbows and hands TOUCHING WALL',
      'Lower slowly. 10 slow reps'
    ]
  },
  'wall-posture': {
    id: 'wall-posture',
    name: 'Wall Posture Hold',
    videoId: 'cvx06snMQ3A',
    phase: 'neural',
    duration: 60,
    reps: null,
    type: 'hold',
    pose: 'standing',
    movement: 'static-hold',
    target: 'Full body, Posture neural reset',
    instructions: [
      'Stand against wall: heels-glutes-shoulders-head touching wall',
      'Slight chin tuck, eyes forward, relax shoulders',
      'Breathe deeply, feel natural upright posture',
      'Hold 60 sec. Memorize this feeling — this is correct posture'
    ]
  },
  /* ---------- ROUTINE B EXERCISES ---------- */
  'fire-hydrant': {
    id: 'fire-hydrant',
    name: 'Fire Hydrant',
    videoId: 'IRkRgk2Gc1E',
    phase: 'warmup',
    duration: 90,
    reps: 12,
    type: 'rep-each-side',
    pose: 'all-fours',
    movement: 'hip-abduction-flexed',
    target: 'Gluteus medius, Gluteus maximus',
    instructions: [
      'Start on all fours, hands under shoulders, knees under hips',
      'Keep knee bent 90°, lift one knee out to the side',
      'Squeeze glutes at the top, do not rotate hips',
      'Lower with control. Complete reps then switch sides'
    ]
  },
  'glute-bridge-march': {
    id: 'glute-bridge-march',
    name: 'Glute Bridge March',
    videoId: 'geC0-toofW4',
    phase: 'warmup',
    duration: 90,
    reps: 10,
    type: 'rep-each-side',
    pose: 'lying-supine',
    movement: 'hip-lift-alternating',
    target: 'Glutes, Core, Hip stability',
    instructions: [
      'Lie on back, knees bent, lift hips into bridge position',
      'Hold bridge — keep hips level, do not let them drop',
      'March one knee toward chest, then lower',
      'Alternate legs. Keep hips stable throughout'
    ]
  },
  'donkey-kick': {
    id: 'donkey-kick',
    name: 'Donkey Kick',
    videoId: 'DDJdkNkepLY',
    phase: 'strengthening',
    duration: 50,
    reps: 15,
    type: 'rep-each-side',
    pose: 'all-fours',
    movement: 'hip-extension-flexed',
    target: 'Gluteus maximus, Hamstrings',
    instructions: [
      'Start on all fours, core engaged, back flat',
      'Keeping knee bent 90°, drive heel toward ceiling',
      'Squeeze glute at top — do not arch lower back',
      'Lower with control. Complete reps then switch'
    ]
  },
  'side-lying-leg-lift': {
    id: 'side-lying-leg-lift',
    name: 'Side-Lying Leg Lift',
    videoId: 'g9FtnmsIYgI',
    phase: 'strengthening',
    duration: 45,
    reps: 15,
    type: 'rep-each-side',
    pose: 'side-lying',
    movement: 'hip-abduction-straight',
    target: 'Gluteus medius, Hip abductors',
    instructions: [
      'Lie on side, bottom leg bent for support, top leg straight',
      'Lift top leg straight up toward ceiling, toes pointing forward',
      'Keep hips stacked — do not roll backward',
      'Lower slowly. Complete reps then switch sides'
    ]
  },
  't-raise': {
    id: 't-raise',
    name: 'Prone T Raise',
    videoId: 'r7ZSEd0E908',
    phase: 'strengthening',
    duration: 35,
    reps: 12,
    type: 'rep',
    pose: 'prone',
    movement: 'scapular-retraction-t',
    target: 'Middle/Lower traps, Rhomboids, Rear delts',
    instructions: [
      'Lie face down, arms out to sides in a T shape, palms down',
      'Squeeze shoulder blades together, lift arms a few inches',
      'Hold 2 seconds at top — lead with mid-back, not neck',
      'Lower slowly. Keep head neutral, do not arch back'
    ]
  },
  'plank-shoulder-tap': {
    id: 'plank-shoulder-tap',
    name: 'Plank Shoulder Tap',
    videoId: '6NTUnpIMDWU',
    phase: 'strengthening',
    duration: 50,
    reps: 10,
    type: 'rep-each-side',
    pose: 'all-fours',
    movement: 'anti-rotation-core',
    target: 'Core, Shoulder stability, Anti-rotation',
    instructions: [
      'Start in high plank: hands under shoulders, body straight',
      'Widen feet slightly for stability, engage abs and glutes',
      'Tap right hand to left shoulder — keep hips STILL',
      'Alternate sides. No hip swaying — core locked'
    ]
  },
  'couch-stretch': {
    id: 'couch-stretch',
    name: 'Couch Stretch',
    videoId: 'cVqb6UdfIpM',
    phase: 'stretching',
    duration: 120,
    reps: null,
    type: 'hold',
    pose: 'half-kneeling',
    movement: 'static-hold',
    target: 'Hip flexors, Quads (deep stretch)',
    instructions: [
      'Place one foot against a wall/couch, drop knee to floor',
      'Drive hips forward, squeeze glute on kneeling side',
      'Keep torso upright — do not arch lower back',
      'Hold 60 sec each side. Breathe deeply into the stretch'
    ]
  },
  'standing-hamstring-stretch': {
    id: 'standing-hamstring-stretch',
    name: 'Standing Hamstring Stretch',
    videoId: 'DnIEfvuJQQE',
    phase: 'stretching',
    duration: 60,
    reps: null,
    type: 'hold',
    pose: 'standing',
    movement: 'static-hold',
    target: 'Hamstrings (back of thighs)',
    instructions: [
      'Stand tall, extend one leg forward with heel on floor, toes up',
      'Keep back straight, chest up — hinge at hips, do not round',
      'Feel stretch in back of thigh, not lower back',
      'Hold 30 sec each side. Bend supporting knee slightly if needed'
    ]
  },
  'thread-the-needle': {
    id: 'thread-the-needle',
    name: 'Thread the Needle',
    videoId: 'UomKzkyp6kQ',
    phase: 'stretching',
    duration: 60,
    reps: null,
    type: 'hold',
    pose: 'all-fours',
    movement: 'thoracic-rotation',
    target: 'Upper back, Shoulders, Thoracic spine',
    instructions: [
      'Start on all fours, reach right arm up toward ceiling, chest opens',
      'Thread right arm under left arm, shoulder and head to floor',
      'Hold 30 sec — feel stretch through upper back and shoulder',
      'Return and switch sides. Keep hips steady'
    ]
  }
};

// ── SCHEDULE: which exercises per day ───────────────────────────
const SCHEDULE = {
  monday: {
    name: 'Monday — Routine A',
    icon: '💪',
    phases: buildPhasesA()
  },
  tuesday: {
    name: 'Tuesday — Routine B',
    icon: '🔥',
    phases: buildPhasesB()
  },
  wednesday: {
    name: 'Wednesday — Routine A',
    icon: '⚡',
    phases: buildPhasesA()
  },
  thursday: {
    name: 'Thursday — Routine B',
    icon: '🔄',
    phases: buildPhasesB()
  },
  friday: {
    name: 'Friday — Routine A',
    icon: '🎯',
    phases: buildPhasesA()
  },
  saturday: {
    name: 'Saturday — Routine B',
    icon: '🌟',
    phases: buildPhasesB(),
    bonus: 'Bonus: 20 min brisk walk or swim 🏊‍♂️🏃'
  },
  sunday: {
    name: 'Sunday - Rest Day',
    icon: '🧘',
    phases: [
      {
        name: 'Light Yoga or Rest',
        nameEn: 'Recovery',
        color: '#a78bfa',
        duration: 1800,
        exercises: ['childs-pose']
      }
    ],
    isRest: true
  }
};

function buildPhasesA() {
  const s = ['single-leg-bridge', 'clamshell', 'prone-y', 'chin-tuck', 'bird-dog'];
  return [
    {
      name: 'Warm-Up & Activation',
      nameEn: 'Warm-Up',
      color: '#ff6b6b',
      duration: 300,
      exercises: ['cat-cow', 'glute-bridge', 'dead-bug']
    },
    {
      name: 'Strengthening (Circuit 1/3)',
      nameEn: 'Strength C1',
      color: '#4ecdc4',
      duration: 240,
      exercises: [...s]
    },
    {
      name: 'Strengthening (Circuit 2/3)',
      nameEn: 'Strength C2',
      color: '#4ecdc4',
      duration: 240,
      exercises: [...s]
    },
    {
      name: 'Strengthening (Circuit 3/3)',
      nameEn: 'Strength C3',
      color: '#4ecdc4',
      duration: 240,
      exercises: [...s]
    },
    {
      name: 'Stretching',
      nameEn: 'Stretching',
      color: '#ffe66d',
      duration: 600,
      exercises: ['hip-flexor-stretch', 'hamstring-stretch', 'pec-stretch', 'upper-trap-stretch', 'downward-dog', 'childs-pose']
    },
    {
      name: 'Neural Reset & Posture',
      nameEn: 'Neural Reset',
      color: '#a78bfa',
      duration: 180,
      exercises: ['wall-angel', 'wall-posture']
    }
  ];
}

function buildPhasesB() {
  const s = ['donkey-kick', 'side-lying-leg-lift', 't-raise', 'chin-tuck', 'plank-shoulder-tap'];
  return [
    {
      name: 'Warm-Up & Activation',
      nameEn: 'Warm-Up',
      color: '#ff6b6b',
      duration: 300,
      exercises: ['fire-hydrant', 'cat-cow', 'glute-bridge-march']
    },
    {
      name: 'Strengthening (Circuit 1/3)',
      nameEn: 'Strength C1',
      color: '#4ecdc4',
      duration: 240,
      exercises: [...s]
    },
    {
      name: 'Strengthening (Circuit 2/3)',
      nameEn: 'Strength C2',
      color: '#4ecdc4',
      duration: 240,
      exercises: [...s]
    },
    {
      name: 'Strengthening (Circuit 3/3)',
      nameEn: 'Strength C3',
      color: '#4ecdc4',
      duration: 240,
      exercises: [...s]
    },
    {
      name: 'Stretching',
      nameEn: 'Stretching',
      color: '#ffe66d',
      duration: 600,
      exercises: ['couch-stretch', 'standing-hamstring-stretch', 'pec-stretch', 'upper-trap-stretch', 'thread-the-needle', 'childs-pose']
    },
    {
      name: 'Neural Reset & Posture',
      nameEn: 'Neural Reset',
      color: '#a78bfa',
      duration: 180,
      exercises: ['wall-angel', 'wall-posture']
    }
  ];
}

// ── FLATTEN: all exercises in order for timer ───────────────────
function flattenSchedule(phases) {
  const flat = [];
  for (const phase of phases) {
    for (const exId of phase.exercises) {
      const ex = EXERCISES[exId];
      if (!ex) {
        console.warn('Missing exercise:', exId);
        continue;
      }
      flat.push({ ...ex, phaseColor: phase.color, phaseName: phase.name });
    }
  }
  return flat;
}

// ── TIMER ENGINE ────────────────────────────────────────────────
class TimerEngine {
  constructor({ onTick, onComplete }) {
    this.total = 0;
    this.remaining = 0;
    this.running = false;
    this.paused = false;
    this.rafId = null;
    this.lastTimestamp = 0;
    this.onTick = onTick;
    this.onComplete = onComplete;
  }

  start(totalSeconds) {
    this.total = totalSeconds;
    this.remaining = totalSeconds;
    this.running = true;
    this.paused = false;
    this.lastTimestamp = performance.now();
    this._loop(this.lastTimestamp);
  }

  pause() {
    if (!this.running) return;
    this.paused = true;
    cancelAnimationFrame(this.rafId);
  }

  resume() {
    if (!this.paused) return;
    this.paused = false;
    this.lastTimestamp = performance.now();
    this._loop(this.lastTimestamp);
  }

  stop() {
    this.running = false;
    this.paused = false;
    cancelAnimationFrame(this.rafId);
  }

  _loop(timestamp) {
    if (!this.running || this.paused) return;
    const delta = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;
    this.remaining = Math.max(0, this.remaining - delta);
    this.onTick(this.remaining);
    if (this.remaining <= 0) {
      this.running = false;
      this.onComplete();
    } else {
      this.rafId = requestAnimationFrame(ts => this._loop(ts));
    }
  }
}

// ── WORKOUT SESSION ─────────────────────────────────────────────
class WorkoutSession {
  constructor(flatExercises, audio) {
    this.exercises = flatExercises;
    this.audio = audio;
    this.currentIdx = 0;
    this.totalDuration = flatExercises.reduce((s, e) => s + e.duration, 0);
    this.phaseIdx = 0;

    this.timer = new TimerEngine({
      onTick: (rem) => this._onTick(rem),
      onComplete: () => this._onExerciseDone()
    });

    this.onUpdate = null;  // (state) => void
    this.onPhaseChange = null; // (phase) => void
    this.onComplete = null; // () => void
  }

  get current() { return this.exercises[this.currentIdx]; }
  get totalExercises() { return this.exercises.length; }

  start() {
    if (this.exercises.length === 0) return;
    this.currentIdx = 0;
    this.phaseIdx = 0;
    this._startCurrent();
  }

  _startCurrent() {
    const ex = this.current;
    if (!ex) { this._finish(); return; }
    this.timer.start(ex.duration);
    this._notify();
  }

  _onTick(remaining) {
    this._notify(remaining);
  }

  _onExerciseDone() {
    this.audio.exerciseEnd();
    this.currentIdx++;
    if (this.currentIdx >= this.exercises.length) {
      this._finish();
      return;
    }
    const nextEx = this.exercises[this.currentIdx];
    const prevEx = this.exercises[this.currentIdx - 1];
    if (nextEx.phaseName !== prevEx.phaseName) {
      this.audio.phaseChange();
      this.phaseIdx++;
      if (this.onPhaseChange) this.onPhaseChange(nextEx.phaseName);
    }
    this._startCurrent();
  }

  _finish() {
    this.timer.stop();
    this.audio.complete();
    if (this.onComplete) this.onComplete();
  }

  skip() {
    this.timer.stop();
    this._onExerciseDone();
  }

  pause() { this.timer.pause(); this._notify(null, true); }
  resume() { this.timer.resume(); }

  _notify(remainingOverride, paused) {
    if (this.onUpdate) {
      this.onUpdate({
        exercise: this.current,
        exerciseIdx: this.currentIdx,
        totalExercises: this.totalExercises,
        remaining: remainingOverride !== undefined ? remainingOverride : this.timer.remaining,
        duration: this.current ? this.current.duration : 0,
        totalDuration: this.totalDuration,
        paused: !!paused,
        running: this.timer.running
      });
    }
  }
}

// ── UI CONTROLLER ───────────────────────────────────────────────
class UIController {
  constructor(audio) {
    this.audio = audio;
    this.session = null;
    this.selectedDay = 'monday';

    // Views
    this.$schedule = document.getElementById('schedule-view');
    this.$workout = document.getElementById('workout-view');
    this.$complete = document.getElementById('complete-view');

    // Schedule elements
    this.$dayTabs = document.getElementById('day-tabs');
    this.$phaseList = document.getElementById('phase-list');
    this.$startBtn = document.getElementById('start-workout');
    this.$bonusNote = document.getElementById('bonus-note');

    // Workout elements
    this.$phaseBanner = document.getElementById('phase-banner');
    this.$exIndex = document.getElementById('ex-index');
    this.$exName = document.getElementById('ex-name');
    this.$exTarget = document.getElementById('ex-target');
    this.$exInstructions = document.getElementById('ex-instructions');
    this.$exReps = document.getElementById('ex-reps');
    this.$timerClock = document.getElementById('timer-clock');
    this.$timerBar = document.getElementById('timer-bar');
    this.$progressBar = document.getElementById('progress-bar');
    this.$btnPause = document.getElementById('btn-pause');
    this.$btnSkip = document.getElementById('btn-skip');

    // Complete elements
    this.$completeMsg = document.getElementById('complete-msg');

    this._bindEvents();
    this.showDay('monday');
  }

  _bindEvents() {
    // Day tabs
    this.$dayTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-day]');
      if (!btn) return;
      this.showDay(btn.dataset.day);
    });

    // Start workout
    this.$startBtn.addEventListener('click', () => this.startWorkout());

    // Pause / Resume
    this.$btnPause.addEventListener('click', () => {
      if (!this.session) return;
      if (this.session.timer.paused) {
        this.session.resume();
        this.$btnPause.textContent = '⏸ Pause';
      } else {
        this.session.pause();
        this.$btnPause.textContent = '▶ Resume';
      }
    });

    // Skip
    this.$btnSkip.addEventListener('click', () => {
      if (this.session) this.session.skip();
    });

    // Complete → back
    this.$complete.addEventListener('click', (e) => {
      if (e.target.id === 'btn-back-schedule') {
        this.showSchedule();
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (!this.session) return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (this.session.timer.paused) {
          this.session.resume();
          this.$btnPause.textContent = '⏸ Pause';
        } else {
          this.session.pause();
          this.$btnPause.textContent = '▶ Resume';
        }
      }
      if (e.code === 'ArrowRight') {
        e.preventDefault();
        this.session.skip();
      }
    });
  }

  showDay(dayKey) {
    this.selectedDay = dayKey;

    // Update tabs
    for (const btn of this.$dayTabs.querySelectorAll('[data-day]')) {
      btn.classList.toggle('active', btn.dataset.day === dayKey);
    }

    const day = SCHEDULE[dayKey];
    if (!day) return;

    // Render phases
    this.$phaseList.innerHTML = day.phases.map((p, pi) => `
      <div class="phase-card" style="border-left-color: ${p.color}">
        <div class="phase-card-header">
          <span class="phase-badge" style="background: ${p.color}">${pi + 1}</span>
          <div>
            <h3>${p.name}</h3>
            <span class="phase-duration">${p.nameEn} · ${Math.floor(p.duration / 60)}:${String(p.duration % 60).padStart(2, '0')}</span>
          </div>
        </div>
        <div class="phase-exercises">
          ${p.exercises.map((eid, i) => {
            const ex = EXERCISES[eid];
            if (!ex) return '';
            const repStr = ex.reps ? `${ex.reps} ${ex.type === 'hold' ? 'giây' : 'reps'}${ex.type.includes('each') ? '/bên' : ''}` : '';
            return `
              <div class="ex-row">
                <span class="ex-num">${i + 1}</span>
                <span class="ex-name">${ex.name}</span>
                <span class="ex-meta">${repStr} · ${ex.duration}s</span>
              </div>`;
          }).join('')}
        </div>
      </div>
    `).join('');

    // Bonus note for Saturday
    if (day.bonus) {
      this.$bonusNote.style.display = 'block';
      this.$bonusNote.textContent = day.bonus;
    } else {
      this.$bonusNote.style.display = 'none';
    }

    // Hide complete view if visible
    this.showSchedule();
  }

  showSchedule() {
    this.$schedule.classList.remove('hidden');
    this.$workout.classList.add('hidden');
    this.$complete.classList.add('hidden');
    document.body.classList.remove('workout-active');
  }

  showWorkout() {
    this.$schedule.classList.add('hidden');
    this.$workout.classList.remove('hidden');
    this.$complete.classList.add('hidden');
    document.body.classList.add('workout-active');
  }

  showComplete() {
    this.$schedule.classList.add('hidden');
    this.$workout.classList.add('hidden');
    this.$complete.classList.remove('hidden');
    document.body.classList.remove('workout-active');
  }

  startWorkout() {
    const day = SCHEDULE[this.selectedDay];
    if (!day || day.isRest) {
      this.$completeMsg.innerHTML = '<h2>🧘 Rest day — enjoy it!</h2><p>Sunday is for recovery. Light walk, yoga, or just relax. Your body needs it.</p>';
      this.showComplete();
      return;
    }

    const flat = flattenSchedule(day.phases);
    if (flat.length === 0) return;

    this.session = new WorkoutSession(flat, this.audio);
    this.showWorkout();

    // Reset UI
    this.$btnPause.textContent = '⏸ Tạm dừng';
    this.$timerClock.textContent = '00:00';
    this.$timerBar.style.width = '0%';
    this.$progressBar.style.width = '0%';
    this.$phaseBanner.textContent = flat[0].phaseName;
    this.$phaseBanner.style.background = flat[0].phaseColor;

    this.session.onUpdate = (state) => {
      this._renderWorkoutState(state);
    };
    this.session.onPhaseChange = (phaseName) => {
      this.$phaseBanner.textContent = phaseName;
      const ex = this.session.current;
      if (ex) this.$phaseBanner.style.background = ex.phaseColor;
    };
    this.session.onComplete = () => {
      this.$completeMsg.innerHTML = `
        <h2>🎉 Done! Great work!</h2>
        <p>You just completed a 30-minute body reset. Stay consistent — your body will thank you.</p>
        <p style="color: #94a3b8; margin-top: 8px;">${flat.length} exercises · ${Math.floor(flat.reduce((s, e) => s + e.duration, 0) / 60)} min</p>
      `;
      this.showComplete();
    };

    this.session.start();
  }

  _renderWorkoutState(state) {
    const { exercise, exerciseIdx, totalExercises, remaining, duration, totalDuration, paused } = state;
    if (!exercise) return;

    // Header
    this.$exIndex.textContent = `${exerciseIdx + 1}/${totalExercises}`;
    this.$exName.textContent = exercise.name;
    this.$exTarget.textContent = exercise.target;

    // Instructions
    this.$exInstructions.innerHTML = exercise.instructions
      .map((inst, i) => `<li>${inst}</li>`).join('');

    // Reps
    if (exercise.reps) {
      const label = exercise.type === 'hold' ? 'Hold' : 'Reps';
      const side = exercise.type.includes('each') ? ' each side' : '';
      this.$exReps.textContent = `${label}: ${exercise.reps}${side}`;
      this.$exReps.style.display = 'block';
    } else {
      this.$exReps.style.display = 'none';
    }

    // Timer
    const mins = Math.floor(remaining / 60);
    const secs = Math.floor(remaining % 60);
    this.$timerClock.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    this.$timerClock.classList.toggle('timer-warn', remaining <= 10);

    // Timer bar
    const pct = duration > 0 ? ((remaining / duration) * 100) : 0;
    this.$timerBar.style.width = `${pct}%`;
    this.$timerBar.style.background = exercise.phaseColor;

    // Overall progress
    let accDuration = 0;
    for (let i = 0; i < this.session.exercises.length; i++) {
      if (i < exerciseIdx) accDuration += this.session.exercises[i].duration;
      else if (i === exerciseIdx) accDuration += (this.session.exercises[i].duration - remaining);
      else break;
    }
    const totalDur = this.session.totalDuration;
    const progressPct = totalDur > 0 ? (accDuration / totalDur) * 100 : 0;
    this.$progressBar.style.width = `${progressPct}%`;

    if (paused) {
      this.$timerClock.classList.add('timer-paused');
    } else {
      this.$timerClock.classList.remove('timer-paused');
    }
  }
}

// ── INIT ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const audio = new AudioEngine();
  new UIController(audio);
});
