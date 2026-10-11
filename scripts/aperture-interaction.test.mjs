import test from 'node:test';
import assert from 'node:assert/strict';
import {initAperture} from '../public/assets/aperture-interaction.js';

function fixture(fine=true) {
  const label={textContent:''};
  const media={matches:fine,addEventListener(){}};
  globalThis.window={matchMedia:()=>media};
  globalThis.document={querySelector:()=>label};
  const control=new EventTarget();
  control.dataset={};
  control.attributes={};
  control.setAttribute=(key,value)=>{control.attributes[key]=value;};
  const emit=(type,props={})=>{const event=new Event(type);Object.assign(event,props);control.dispatchEvent(event);};
  initAperture(control);
  return {control,label,emit};
}

test('desktop hover closes and leaving restores the aperture without sticking',()=>{
  const {control,label,emit}=fixture();
  assert.equal(control.dataset.active,'false');
  emit('pointerenter',{pointerType:'mouse'});
  assert.equal(control.dataset.active,'true');
  assert.equal(label.textContent,'FOCUS');
  emit('click',{pointerType:'mouse',detail:1});
  emit('pointerleave');
  assert.equal(control.dataset.active,'false');
  for(let i=0;i<5;i++){emit('pointerenter',{pointerType:'mouse'});emit('pointerleave');}
  assert.equal(control.attributes['aria-pressed'],'false');
});

test('touch toggles the same state and keyboard supports Enter/Space and Escape',()=>{
  const touch=fixture(false);
  touch.emit('click',{pointerType:'touch',detail:1});
  assert.equal(touch.control.dataset.active,'true');
  touch.emit('click',{pointerType:'touch',detail:1});
  assert.equal(touch.control.dataset.active,'false');
  const keyboard=fixture();
  keyboard.emit('click',{detail:0});
  assert.equal(keyboard.control.dataset.input,'keyboard');
  assert.equal(keyboard.control.dataset.active,'true');
  keyboard.emit('keydown',{key:'Escape'});
  assert.equal(keyboard.control.dataset.active,'false');
  keyboard.emit('click',{detail:0});
  keyboard.emit('blur');
  assert.equal(keyboard.control.dataset.active,'false');
});
