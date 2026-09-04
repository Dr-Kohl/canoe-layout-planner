'use client';

import { useMemo, useState } from 'react';
import '../canoe.css';
import './planner.css';

type Member = { id: number; name: string; quantity: number; length: number };

const STOCK_LENGTH = 55 * 12;
const STOCK_WIDTH = 41;

function feet(inches: number) {
  return `${(inches / 12).toFixed(1)} ft`;
}

export default function LayoutPlanner() {
  const [canoeLength, setCanoeLength] = useState(6);
  const [skinStrips, setSkinStrips] = useState(2);
  const [sideHeight, setSideHeight] = useState(12);
  const [rollWidth, setRollWidth] = useState(10);
  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: 'Cross frames', quantity: 6, length: 24 },
    { id: 2, name: 'Longitudinal members', quantity: 4, length: 60 },
  ]);

  const plan = useMemo(() => {
    const skinLengthPerStrip = canoeLength * 12 + 2 * sideHeight + 6;
    const skinLength = skinLengthPerStrip * skinStrips;
    const frameLength = STOCK_LENGTH - skinLength;
    const lanes = Math.floor(STOCK_WIDTH / rollWidth);
    const laneFeet = frameLength / 12;
    const frameDemand = members.reduce((sum, member) => sum + member.quantity * member.length, 0);
    const frameUsed = Math.ceil(frameDemand / Math.max(1, lanes));
    const remaining = frameLength - frameUsed;
    return { skinLengthPerStrip, skinLength, frameLength, lanes, laneFeet, frameDemand, frameUsed, remaining, totalUsed: skinLength + frameUsed };
  }, [canoeLength, skinStrips, sideHeight, rollWidth, members]);

  const updateMember = (id: number, key: keyof Omit<Member, 'id'>, value: string) => {
    setMembers((current) => current.map((member) => member.id === id ? { ...member, [key]: key === 'name' ? value : Math.max(0, Number(value)) } : member));
  };

  const reset = () => {
    setCanoeLength(6); setSkinStrips(2); setSideHeight(12); setRollWidth(10);
    setMembers([{ id: 1, name: 'Cross frames', quantity: 6, length: 24 }, { id: 2, name: 'Longitudinal members', quantity: 4, length: 60 }]);
  };

  const addMember = () => setMembers((current) => [...current, { id: Date.now(), name: 'New frame part', quantity: 1, length: 24 }]);

  return <main>
    <header className="site-header"><div><p className="eyebrow">EGGN 1910 · Engineering Exploration</p><h1>Canoe Layout Planner</h1></div><button className="reset" onClick={reset}>Reset plan</button></header>
    <section className="intro"><p className="kicker">Plan the cuts before you build.</p><p>Your team receives <strong>55 feet of 41-inch-wide waxed paper board</strong>. Reserve the skin first, then see how much remains for the 10-inch rolled frame pieces.</p><p><a className="tool-link" href="/canoe-layout-planner/float-lab/">Open the Cardboard Boat Float Lab →</a></p></section>
    <section className="planner-grid">
      <aside className="controls-card"><h2>1. Set the stock plan</h2>
        <label className="planner-field"><span>Canoe length</span><div><input type="number" min="4" max="10" step="0.5" value={canoeLength} onChange={(e) => setCanoeLength(Number(e.target.value))} /><b>ft</b></div></label>
        <label className="planner-field"><span>Side height</span><div><input type="number" min="4" max="24" step="1" value={sideHeight} onChange={(e) => setSideHeight(Number(e.target.value))} /><b>in</b></div></label>
        <label className="planner-field"><span>Skin strips</span><div><input type="number" min="1" max="4" value={skinStrips} onChange={(e) => setSkinStrips(Number(e.target.value))} /><b>full-length strips</b></div></label>
        <div className="planner-tip"><strong>Continuous skin allowance</strong><br />Each strip is {feet(plan.skinLengthPerStrip)}: {canoeLength.toFixed(1)} ft canoe length + {sideHeight * 2} in for both ends + 6 in of wrap.</div>
        <label className="planner-field"><span>Frame roll width</span><div><input type="number" min="6" max="20" value={rollWidth} onChange={(e) => setRollWidth(Number(e.target.value))} /><b>in</b></div></label>
        <div className="planner-tip"><strong>Width insight</strong><br />At {rollWidth} in wide, the 41 in sheet makes <b>{plan.lanes}</b> complete lanes, with {STOCK_WIDTH - plan.lanes * rollWidth} in left over for trim or a narrow strip.</div>
        <h2 className="step-two">2. Add frame parts</h2>
        <p className="helper">Enter the length of each piece before it is rolled.</p>
        {members.map((member) => <div className="member-row" key={member.id}><input aria-label="Part name" value={member.name} onChange={(e) => updateMember(member.id, 'name', e.target.value)} /><label><input aria-label="Quantity" type="number" min="0" value={member.quantity} onChange={(e) => updateMember(member.id, 'quantity', e.target.value)} /> qty</label><label><input aria-label="Piece length in inches" type="number" min="0" value={member.length} onChange={(e) => updateMember(member.id, 'length', e.target.value)} /> in</label></div>)}
        <button className="add-part" onClick={addMember}>+ Add another part</button>
      </aside>
      <section className="visual-card planner-visual"><div className="stock-heading"><div><p className="eyebrow">Cut map</p><h2>55 ft × 41 in stock sheet</h2></div><strong>{plan.totalUsed > STOCK_LENGTH ? 'Over allowance' : `${feet(STOCK_LENGTH - plan.totalUsed)} remains`}</strong></div>
        <div className="sheet-map" style={{ '--skin': `${Math.min(100, plan.skinLength / STOCK_LENGTH * 100)}%`, '--frame': `${Math.min(100, plan.frameUsed / STOCK_LENGTH * 100)}%` } as React.CSSProperties}><div className="skin-zone"><b>SKIN</b><span>{feet(plan.skinLength)}</span></div><div className="frame-zone"><b>FRAME ROLLS</b><span>{plan.lanes} × {feet(plan.frameLength)} lanes</span>{Array.from({ length: Math.min(plan.lanes, 5) }).map((_, index) => <i key={index} style={{ top: `${18 + index * 15}%` }} />)}</div><div className="waste-zone"><b>AVAILABLE</b><span>{feet(Math.max(0, plan.remaining))}</span></div></div>
        <div className="map-legend"><span><i className="swatch skin-swatch" /> Skin reserve</span><span><i className="swatch frame-swatch" /> Frame roll lanes</span><span><i className="swatch waste-swatch" /> Unassigned</span></div>
        <div className={`planner-status ${plan.remaining < 0 ? 'danger' : plan.remaining < 36 ? 'caution' : 'good'}`}><strong>{plan.remaining < 0 ? 'The plan is over the 55 ft allowance.' : plan.remaining < 36 ? 'This plan is tight.' : 'The plan fits.'}</strong><span>{feet(Math.max(0, plan.remaining))} is unassigned after the entered parts.</span></div>
        <div className="planner-summary"><div><span>Skin reserve</span><b>{feet(plan.skinLength)}</b><small>{skinStrips} strips × {feet(plan.skinLengthPerStrip)} each</small></div><div><span>Frame demand</span><b>{feet(plan.frameDemand)}</b><small>{members.reduce((sum, member) => sum + member.quantity, 0)} pieces total</small></div><div><span>Usable frame lanes</span><b>{plan.lanes}</b><small>{rollWidth} in each across 41 in</small></div></div>
      </section>
    </section>
    <section className="explain"><div><p className="kicker">How to use this</p><h2>Think in strips, then think in parts.</h2></div><div className="equation"><span>Planning model</span><strong>55 ft stock − skin reserve = frame stock</strong><small>Frame demand is divided across the complete 10-inch lanes. The map is an estimate for planning; leave room for seams, overlaps, damaged edges, and mistakes.</small></div></section>
  </main>;
}
