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
  }
};

// ── SCHEDULE: which exercises per day ───────────────────────────
const SCHEDULE = {
  monday: {
    name: 'Monday - Full Routine',
    icon: '💪',
    phases: buildPhases()
  },
  tuesday: {
    name: 'Tuesday - Full Routine',
    icon: '🔥',
    phases: buildPhases()
  },
  wednesday: {
    name: 'Wednesday - Full Routine',
    icon: '⚡',
    phases: buildPhases()
  },
  thursday: {
    name: 'Thursday - Full Routine',
    icon: '🔄',
    phases: buildPhases()
  },
  friday: {
    name: 'Friday - Full Routine',
    icon: '🎯',
    phases: buildPhases()
  },
  saturday: {
    name: 'Saturday - Full + Cardio',
    icon: '🌟',
    phases: buildPhases(),
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

function buildPhases() {
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
    if (nextEx.phaseColor !== prevEx.phaseColor) {
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
    this.$exFigure = document.getElementById('ex-figure');
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
      this.$bonusNote.textContent = '🌟 ' + day.bonus;
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
      const label = exercise.type === 'hold' ? 'Giữ' : 'Reps';
      const side = exercise.type.includes('each') ? ' mỗi bên' : '';
      this.$exReps.textContent = `${label}: ${exercise.reps}${side}`;
      this.$exReps.style.display = 'block';
    } else {
      this.$exReps.style.display = 'none';
    }

    // Figure
    this._renderFigure(exercise);

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

  _renderFigure(exercise) {
    const poses = {
      'all-fours': { viewBox: '0 0 140 140', draw: this._drawAllFours },
      'lying-supine': { viewBox: '0 0 140 100', draw: this._drawLyingSupine },
      'side-lying': { viewBox: '0 0 100 120', draw: this._drawSideLying },
      'prone': { viewBox: '0 0 140 100', draw: this._drawProne },
      'standing': { viewBox: '0 0 100 160', draw: this._drawStanding },
      'half-kneeling': { viewBox: '0 0 120 140', draw: this._drawHalfKneeling },
      'seated': { viewBox: '0 0 140 120', draw: this._drawSeated },
      'inverted': { viewBox: '0 0 120 140', draw: this._drawInverted },
      'kneeling': { viewBox: '0 0 100 140', draw: this._drawKneeling }
    };

    const cfg = poses[exercise.pose] || poses['standing'];
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', cfg.viewBox);
    svg.classList.add('figure-svg');
    cfg.draw.call(this, svg, exercise);

    this.$exFigure.innerHTML = '';
    this.$exFigure.appendChild(svg);
  }

  // ── FIGURE DRAWING HELPERS ──────────────────────
  _el(tag, attrs = {}) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [k, v] of Object.entries(attrs)) {
      el.setAttribute(k, String(v));
    }
    return el;
  }

  _line(x1, y1, x2, y2, cls = '') {
    return this._el('line', { x1, y1, x2, y2, class: `limb ${cls}` });
  }

  _circle(cx, cy, r, cls = '') {
    return this._el('circle', { cx, cy, r, class: `joint ${cls}` });
  }

  _head(cx, cy) {
    return this._el('circle', { cx, cy, r: '8', class: 'head' });
  }

  /* All-fours: cat-cow, bird-dog */
  _drawAllFours(svg, ex) {
    const g = this._el('g', { class: 'fig-allfours' });
    g.appendChild(this._head(50, 18));                    // head
    g.appendChild(this._line(50, 26, 50, 65));            // torso (spine)
    g.appendChild(this._line(50, 36, 30, 55));            // arm L upper
    g.appendChild(this._line(30, 55, 15, 75));            // arm L lower
    g.appendChild(this._line(50, 36, 70, 55));            // arm R upper
    g.appendChild(this._line(70, 55, 85, 75));            // arm R lower
    g.appendChild(this._line(50, 65, 35, 90));            // leg L upper
    g.appendChild(this._line(35, 90, 28, 115));           // leg L lower
    g.appendChild(this._line(50, 65, 65, 90));            // leg R upper
    g.appendChild(this._line(65, 90, 72, 115));           // leg R lower
    // Floor line
    g.appendChild(this._el('line', { x1: 8, y1: 115, x2: 92, y2: 115, class: 'floor' }));
    svg.appendChild(g);
  }

  /* Lying supine: glute bridge, dead bug, single-leg bridge */
  _drawLyingSupine(svg, ex) {
    const g = this._el('g', { class: 'fig-lying' });
    g.appendChild(this._head(95, 35));                    // head
    g.appendChild(this._line(87, 35, 52, 35));            // torso
    g.appendChild(this._line(75, 35, 58, 55));            // arm L
    g.appendChild(this._line(65, 35, 48, 55));            // arm R
    g.appendChild(this._line(48, 35, 32, 50));            // leg L upper
    g.appendChild(this._line(32, 50, 18, 18));            // leg L lower
    g.appendChild(this._line(58, 35, 68, 50));            // leg R upper
    g.appendChild(this._line(68, 50, 80, 18));            // leg R lower
    g.appendChild(this._el('line', { x1: 5, y1: 18, x2: 95, y2: 18, class: 'floor' }));
    svg.appendChild(g);
  }

  /* Side-lying: clamshell */
  _drawSideLying(svg, ex) {
    const g = this._el('g', { class: 'fig-sidelying' });
    g.appendChild(this._head(30, 20));
    g.appendChild(this._line(30, 28, 30, 55));
    g.appendChild(this._line(30, 35, 48, 25));
    g.appendChild(this._line(30, 35, 48, 45));
    g.appendChild(this._line(30, 55, 18, 75));
    g.appendChild(this._line(18, 75, 8, 95));
    g.appendChild(this._line(30, 55, 42, 68));
    g.appendChild(this._line(42, 68, 52, 85));
    g.appendChild(this._el('line', { x1: 5, y1: 95, x2: 55, y2: 95, class: 'floor' }));
    svg.appendChild(g);
  }

  /* Prone: Y raise */
  _drawProne(svg, ex) {
    const g = this._el('g', { class: 'fig-prone' });
    g.appendChild(this._head(45, 12));
    g.appendChild(this._line(45, 20, 45, 45));
    g.appendChild(this._line(45, 25, 20, 10));            // arm L up (Y)
    g.appendChild(this._line(45, 25, 70, 10));            // arm R up (Y)
    g.appendChild(this._line(45, 45, 30, 58));
    g.appendChild(this._line(30, 58, 20, 72));
    g.appendChild(this._line(45, 45, 60, 58));
    g.appendChild(this._line(60, 58, 70, 72));
    g.appendChild(this._el('line', { x1: 10, y1: 72, x2: 80, y2: 72, class: 'floor' }));
    svg.appendChild(g);
  }

  /* Standing: chin tuck, pec stretch, trap stretch, wall angel, wall posture */
  _drawStanding(svg, ex) {
    const g = this._el('g', { class: 'fig-standing' });
    g.appendChild(this._head(50, 18));
    g.appendChild(this._line(50, 26, 50, 78));
    g.appendChild(this._line(50, 36, 30, 58));
    g.appendChild(this._line(30, 58, 15, 78));
    g.appendChild(this._line(50, 36, 70, 58));
    g.appendChild(this._line(70, 58, 85, 78));
    g.appendChild(this._line(50, 78, 38, 108));
    g.appendChild(this._line(38, 108, 32, 138));
    g.appendChild(this._line(50, 78, 62, 108));
    g.appendChild(this._line(62, 108, 68, 138));
    // Wall line for wall exercises
    if (ex.id === 'wall-angel' || ex.id === 'wall-posture') {
      g.appendChild(this._el('line', { x1: 95, y1: 5, x2: 95, y2: 145, class: 'wall' }));
    }
    g.appendChild(this._el('line', { x1: 15, y1: 138, x2: 85, y2: 138, class: 'floor' }));
    svg.appendChild(g);
  }

  /* Half-kneeling: hip flexor stretch */
  _drawHalfKneeling(svg, ex) {
    const g = this._el('g', { class: 'fig-halfkneel' });
    g.appendChild(this._head(50, 15));
    g.appendChild(this._line(50, 23, 50, 65));
    g.appendChild(this._line(50, 32, 30, 52));
    g.appendChild(this._line(50, 32, 70, 52));
    g.appendChild(this._line(50, 65, 35, 85));            // kneeling leg
    g.appendChild(this._line(35, 85, 25, 102));
    g.appendChild(this._line(50, 65, 65, 80));            // forward leg
    g.appendChild(this._line(65, 80, 68, 102));
    g.appendChild(this._el('line', { x1: 15, y1: 102, x2: 80, y2: 102, class: 'floor' }));
    svg.appendChild(g);
  }

  /* Seated: hamstring stretch */
  _drawSeated(svg, ex) {
    const g = this._el('g', { class: 'fig-seated' });
    g.appendChild(this._head(60, 18));
    g.appendChild(this._line(55, 26, 45, 60));
    g.appendChild(this._line(48, 32, 35, 48));
    g.appendChild(this._line(42, 42, 60, 50));
    g.appendChild(this._line(45, 60, 30, 85));            // leg L
    g.appendChild(this._line(30, 85, 18, 110));
    g.appendChild(this._line(45, 60, 60, 85));            // leg R
    g.appendChild(this._line(60, 85, 72, 110));
    g.appendChild(this._el('line', { x1: 5, y1: 110, x2: 85, y2: 110, class: 'floor' }));
    svg.appendChild(g);
  }

  /* Inverted: downward dog */
  _drawInverted(svg, ex) {
    const g = this._el('g', { class: 'fig-inverted' });
    g.appendChild(this._head(60, 50));                    // head between arms
    g.appendChild(this._line(60, 58, 60, 85));            // torso (inverted)
    g.appendChild(this._line(60, 38, 30, 15));            // arm L
    g.appendChild(this._line(30, 15, 15, 5));
    g.appendChild(this._line(60, 38, 90, 15));            // arm R
    g.appendChild(this._line(90, 15, 105, 5));
    g.appendChild(this._line(60, 85, 45, 105));           // leg L
    g.appendChild(this._line(45, 105, 38, 125));
    g.appendChild(this._line(60, 85, 75, 105));           // leg R
    g.appendChild(this._line(75, 105, 82, 125));
    g.appendChild(this._el('line', { x1: 5, y1: 125, x2: 115, y2: 125, class: 'floor' }));
    svg.appendChild(g);
  }

  /* Kneeling: child's pose */
  _drawKneeling(svg, ex) {
    const g = this._el('g', { class: 'fig-kneeling' });
    g.appendChild(this._head(25, 25));                    // head low
    g.appendChild(this._line(25, 33, 38, 60));            // torso angled
    g.appendChild(this._line(32, 28, 8, 10));             // arm L forward
    g.appendChild(this._line(18, 28, 2, 8));              // arm R forward
    g.appendChild(this._line(38, 60, 30, 85));            // leg L
    g.appendChild(this._line(30, 85, 28, 110));
    g.appendChild(this._line(38, 60, 46, 85));            // leg R
    g.appendChild(this._line(46, 85, 48, 110));
    g.appendChild(this._el('line', { x1: 2, y1: 110, x2: 60, y2: 110, class: 'floor' }));
    svg.appendChild(g);
  }
}

// ── INIT ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const audio = new AudioEngine();
  new UIController(audio);
});
