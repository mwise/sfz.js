# sfz.js
![Release](https://github.com/kmturley/sfz.js/workflows/Release/badge.svg)

SFZ player using the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API), built with:

* NodeJS 16.x
* Javascript


## Installation

Install dependencies using:

    npm install


## Usage

Run the development server using:

    npm run dev

Create a build using:

    npm run build


## Opcodes supported

    volume
    pan
    transpose
    tune
    pitch_keycenter
    pitch_keytrack
    pitch_veltrack
    bend_up
    bend_down


TODO:

    seq_length
    seq_position
    group= (pg 377)
    off_by (pg 377)
    width (pg 383)
    position (pg 383)
    amp_keytrack
    amp_veltrack

    LFOs
    lfoN_wave
    lfoN_pitch
    lfoN_delay
    lfoN_freq
    lfoN_pitch_onccX
    lfoN_pitch_onccX

    Flexible EG
    egN_cutoff
    egN_sustain
    egN_timeX
    egN_levelX
    egN_shapeX
    egN_timeX
    egN_levelX
    egN_shapeX
    egN_timeX
    egN_levelX
    egN_shapeX
    egN_timeX
    egN_levelX
    egN_shapeX
    egN_timeX
    egN_levelX
    egN_shapeX
    egN_timeX
    egN_levelX
    egN_shapeX


## Opcodes not supported

    Flexible Envelope Generators


The following opcodes are not implemented, and won't be in the near term:

    load_mode
    load_start
    load_end
    sample_quality
    image
    oscillator
    oscillator_phase
    oscillator_quality
    oscillator_table_size
    oscillator_multi
    oscillator_mode
    oscillator_detune
    oscillator_detune_oncc
    oscillator_mod_depth
    oscillator_mod_depth_oncc
    oscillator_mod_smooth
    oscillator_mod_smoothcc
    polyphony
    reverse_locc
    reverse_hicc
    start_hicc
    stop_hicc
    start_locc
    stop_locc
    sw_lokey
    sw_hikey
    sw_last
    sw_down
    sw_up
    sw_previous
    sw_vel
    sustain_sw
    sostenuto_sw
    trigger
    rt_decay
    rt_dead
    off_mode
    on_loccN
    on_hiccN
    count
    delay
    delay_beats
    stop_beats
    delay_ccN
    delay_onccN
    delay_random
    delay_samples
    delay_samples_oncc
    loop_crossfade
    offset_random
    offset_ccN
    offset_onccN
    sync_beats
    sync_offset
    amp_random
    output
    gain_ccN
    gain_onccN
    xfin_lokey
    xfin_hikey
    xfout_lokey
    xfout_hikey
    xf_keycurve
    xfin_lovel
    xfin_hivel
    xfout_lovel
    xfout_hivel
    xf_velcurve
    xfin_loccN
    xfin_hiccN
    xfout_loccN
    xfout_hiccN
    xf_cccurve
    pitch_random
    pitch_onccN
    pitch_curvecc
    pitch_stepcc
    bend_step
    bend_stepup
    bend_stepdown
    fil2_type
    cutoff2
    cutoff2_onccN
    cutoff2_stepccN
    cutoff2_curveccN
    cutoff_smoothoncc
    cutoff_chanaft
    cutoff_polyaft
    resonance_onccN
    resonance2_onccN
    resonance_smoothccN
    resonance2_smoothccN
    resonance_curveccN
    resonance2_curveccN
    fil2_keytrack
    fil2_keycenter
    fil2_veltrack
    fil_random
    noise_filter
    noise_stereo
    noise_level
    noise_level_oncc
    noise_level_smoothccN
    noise_step
    noise_step_onccN
    noise_tone
    noise_tone_onccN
    pitcheg_delay
    pitcheg_start
    pitcheg_attack
    pitcheg_hold
    pitcheg_decay
    pitcheg_sustain
    pitcheg_release
    pitcheg_depth
    pitcheg_vel2delay
    pitcheg_vel2attack
    pitcheg_vel2hold
    pitcheg_vel2decay
    pitcheg_vel2sustain
    pitcheg_vel2release
    pitcheg_vel2depth

    Effects (all ef_* opcodes, pg 399)
