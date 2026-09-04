'use client';

import { useMemo, useState } from 'react';
import './canoe.css';

const WATER_WEIGHT = 62.4;
type RangeControlProps = { label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (value: number) => void };

function RangeControl({ label, value, min, max, step, unit, onChange }: RangeControlProps) {
  return <label className="control"><span className="control-label">{label}</span><span className="control-value">{value} <small>{unit}</small></span><input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} aria-label={label} /><span className="range-ends"><span>{min}</span><span>{max}</span></span></label>;
}

export default function Home() {
  const [length, setLength] = useState(10);
  const [width, setWidth] = useState(24);
  const [sideHeight, setSideHeight] = useState(12);
  const [boatWeight, setBoatWeight] = useState(7);
  const [cargoWeight, setCargoWeight] = useState(350);
  const [bow, setBow] = useState<'flat' | 'triangle'>('flat');

  const result = useMemo(() => {
    const widthFt = width / 12;
    const heightFt = sideHeight / 12;
    const shapeFactor = bow === 'triangle' ? 0.875 : 1;
    const footprint = length * widthFt * shapeFactor;
    const totalWeight = boatWeight + cargoWeight;
    const draftFt = totalWeight / (WATER_WEIGHT * footprint);
    const freeboardIn = Math.max(0, (heightFt - draftFt) * 12);
    const maxSupport = WATER_WEIGHT * footprint * heightFt;
    const displacedVolume = totalWeight / WATER_WEIGHT;
    const remainingCapacity = Math.max(0, maxSupport - totalWeight);
    const percentSubmerged = (draftFt / heightFt) * 100;
    const lengthIn = length * 12;
    const flatSkinArea = lengthIn * width + 2 * lengthIn * sideHeight + 2 * width * sideHeight;
    const bowLengthIn = lengthIn * 0.25;
    const triangleSkinArea = lengthIn * width * shapeFactor + 2 * sideHeight * ((lengthIn * 0.75) + Math.hypot(bowLengthIn, width / 2)) + width * sideHeight;
    const skinAreaIn = bow === 'triangle' ? triangleSkinArea : flatSkinArea;
    const developedSkinWidthIn = width + 2 * sideHeight;
    const continuousStrips = Math.ceil(developedSkinWidthIn / 41);
    const cardboardLengthFt = continuousStrips * length;
    const cardboardRemainingFt = 55 - cardboardLengthFt;
    const cardboardPercent = (cardboardLengthFt / 55) * 100;
    const status = draftFt > heightFt ? { title: 'Overloaded', note: 'The waterline is above the cardboard edge.', tone: 'danger' } : freeboardIn < 6 ? { title: 'Low freeboard', note: 'It floats, but waves or motion could be a problem.', tone: 'caution' } : { title: 'Comfortable margin', note: 'The model leaves at least 6 inches above the water.', tone: 'good' };
    return { shapeFactor, totalWeight, draftFt, freeboardIn, maxSupport, displacedVolume, remainingCapacity, percentSubmerged, skinAreaIn, developedSkinWidthIn, continuousStrips, cardboardLengthFt, cardboardRemainingFt, cardboardPercent, status };
  }, [length, width, sideHeight, boatWeight, cargoWeight, bow]);

  const reset = () => { setLength(10); setWidth(24); setSideHeight(12); setBoatWeight(7); setCargoWeight(350); setBow('flat'); };

  return <main>
    <header className="site-header"><div><p className="eyebrow">EGGN 1910 · Engineering Exploration</p><h1>Cardboard Boat Float Lab</h1></div><button className="reset" onClick={reset}>Reset model</button></header>
    <section className="intro"><p className="kicker">Change the dimensions. Watch the waterline.</p><p>This is a <strong>flat-bottom box model</strong> for comparing design choices. Add a triangular bow only if your team plans to make one.</p><p><a className="tool-link" href="?tool=layout">Plan your cardboard layout →</a></p></section>
    <section className="workspace" aria-label="Boat buoyancy model">
      <aside className="controls-card"><h2>1. Choose your boat</h2><RangeControl label="Length" value={length} min={4} max={14} step={0.5} unit="ft" onChange={setLength} /><RangeControl label="Width" value={width} min={12} max={36} step={1} unit="in" onChange={setWidth} /><RangeControl label="Side height" value={sideHeight} min={6} max={18} step={1} unit="in" onChange={setSideHeight} /><div className="segmented" role="group" aria-label="Bow shape"><span className="control-label">Front end</span><button className={bow === 'flat' ? 'selected' : ''} onClick={() => setBow('flat')}>Flat end</button><button className={bow === 'triangle' ? 'selected' : ''} onClick={() => setBow('triangle')}>Triangle bow</button></div><h2 className="step-two">2. Add the load</h2><RangeControl label="Cardboard boat weight" value={boatWeight} min={5} max={10} step={0.5} unit="lb" onChange={setBoatWeight} /><RangeControl label="People weight (two adults)" value={cargoWeight} min={200} max={500} step={10} unit="lb" onChange={setCargoWeight} /></aside>
      <section className="visual-card" aria-label="Boat visual and waterline"><div className="boat-scene"><div className="scene-label">Estimated waterline</div><div className="sky-explainer"><span>How it works</span><strong>Displaced volume = length × width × draft × shape factor</strong><small>The boat must push aside its own weight in fresh water.</small></div><img className="course-banner" src="course-mark.png" alt="Engineering, Computing, and Christian Vocation" /><div className="boat-wrap" style={{ '--waterline': `${80 - result.percentSubmerged * 0.2}%` } as React.CSSProperties}><div className={`boat ${bow === 'triangle' ? 'triangle-bow' : ''}`}><div className="boat-interior"><i /><i /><i /><i /></div><div className="boat-top" /><div className="boat-body"><span>waxed cardboard shell</span></div><div className="tape-seam tape-one" /><div className="tape-seam tape-two" /></div><div className="water"><span>fresh water</span></div></div></div><div className={`status ${result.status.tone}`}><strong>{result.status.title}</strong><span>{result.status.note}</span></div><p className="question"><strong>Try this:</strong> Make the boat wider without changing its total weight. What happens to the draft and freeboard?</p></section>
      <aside className="results-card"><h2>What the model predicts</h2><div className="primary-result"><span>Freeboard</span><strong>{result.freeboardIn.toFixed(1)} <small>in</small></strong><p>hull above the water</p></div><dl><div><dt>Total load</dt><dd>{result.totalWeight.toFixed(0)} lb</dd></div><div><dt>Draft</dt><dd>{(result.draftFt * 12).toFixed(1)} in</dd></div><div><dt>Water displaced</dt><dd>{result.displacedVolume.toFixed(2)} ft³</dd></div><div><dt>Support at top edge</dt><dd>{result.maxSupport.toFixed(0)} lb</dd></div><div><dt>Remaining margin</dt><dd>{result.remainingCapacity.toFixed(0)} lb</dd></div></dl><div className="material-output"><span>Continuous skin stock</span><strong>{result.cardboardLengthFt.toFixed(1)} <small>ft</small></strong><p>{result.continuousStrips} full-length {result.continuousStrips === 1 ? 'strip' : 'strips'} × {length.toFixed(1)} ft</p><div className="roll-label"><span>{result.developedSkinWidthIn.toFixed(0)} in developed width; 41 in roll</span><b>{result.cardboardPercent.toFixed(0)}% used</b></div><div className="roll-sheet" aria-label={`${result.cardboardPercent.toFixed(0)} percent of the cardboard roll used`}><div className={result.cardboardPercent > 100 ? 'roll-used over' : 'roll-used'} style={{ width: `${Math.min(100, result.cardboardPercent)}%` }} /></div><em>{result.cardboardRemainingFt >= 0 ? `${result.cardboardRemainingFt.toFixed(1)} ft remains from the 55 ft allowance` : `${Math.abs(result.cardboardRemainingFt).toFixed(1)} ft beyond the 55 ft allowance`}</em><small className="area-detail">Skin area: {result.skinAreaIn.toFixed(0)} in² (geometry only)</small></div><div className="math-note"><strong>Material note</strong><br />The roll bar reserves continuous bottom-and-side strips. End panels, seams, overlaps, tape, and reinforcements must come from the remaining material. The {bow === 'flat' ? 'flat end' : 'triangle bow'} uses a {result.shapeFactor.toFixed(3)} shape factor.</div></aside>
    </section>
  </main>;
}
