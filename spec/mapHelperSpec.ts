/// <reference path="./html2js.d.ts" />
import mapHelper = require('../source/javascripts/mapHelper');
import $ from "jquery";
import PrintableMap from '../source/javascripts/mapHelper';

const SITE_URL = 'codeforjapan.github.io';
const MIERUNE_KEY = 'KNmswjVYR187ACBqbsZc5fEIBM_DC2TXwMST0tVMe4AiYCt274X0VqAy5pf-ebvl8CtjAtBx15r1YyAiXURC';

describe('tileServerAttribution', () => {
  it('returns openstreetmap license for testing environment', function() {
    expect(mapHelper.tileServerAttribution('localhost:4567')).toBe('Map data © <a href="http://openstreetmap.org/">OpenStreetMap</a>');
  });
  it('returns MIERUNE license for production environment', function() {
    expect(mapHelper.tileServerAttribution(SITE_URL)).toBe("Maptiles by <a href='http://mierune.co.jp/' target='_blank'>MIERUNE</a>, under CC BY. Data by <a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors, under ODbL.");
  });
});

describe('tileServerUrl', () => {
  it ('returns openstreetmap tile url', function () {
    expect(mapHelper.tileServerUrl('color', 'localhost:4567')).toBe('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
  });
  it ('returns MIERUNE tile url(bright)', function () {
    const styleCode = 'bright';
    expect(mapHelper.tileServerUrl('color', SITE_URL)).toBe('https://tile.cdn.mierune.co.jp/styles/' + styleCode + '/{z}/{x}/{y}.png?key=' + MIERUNE_KEY);
  });
  it ('returns MIERUNE tile url(mono)', function () {
    const styleCode = 'gray';
    expect(mapHelper.tileServerUrl('mono', SITE_URL)).toBe('https://tile.cdn.mierune.co.jp/styles/' + styleCode + '/{z}/{x}/{y}.png?key=' + MIERUNE_KEY);
  });
  it ('returns MIERUNE tile url(other)', function () {
    const styleCode = 'normal';
    expect(mapHelper.tileServerUrl('other', SITE_URL)).toBe('https://tile.cdn.mierune.co.jp/styles/' + styleCode + '/{z}/{x}/{y}.png?key=' + MIERUNE_KEY);
  });
})

describe('Map contractor', () => {
  beforeEach(function() {
    document.body.innerHTML = '<div id="map"/>';
  });
  it ('throw error when no divid', function(){
    expect(function(){new PrintableMap('localhost:4567', 'mapid');}).toThrowError('Map container not found.');
  });
})

describe('Load map', () => {
  beforeEach(function() {
    document.body.innerHTML = '<div id="map"/>';
    // document.body.innerHTML = __html__["source/map.html.haml"] //@todo to be fixed. somehow this doesn’t work...
  });
  it ('initialize properties', function(){
    let map = new PrintableMap('localhost:4567', 'map');
    expect(map.host).toBe('localhost:4567');
    expect(map.divid).toBe('map');
  })
  it ('load map class using OpenStreetMap', function() {
    let map = new PrintableMap("localhost:4567", "map");
    expect($("#map").hasClass("leaflet-container")).toBe(true);
    expect($("#map").text()).toMatch(/.*OpenStreetMap.*/);
  });
  it ('load map class using Mierune Map', function() {
    let map = new PrintableMap(SITE_URL, "map");
    console.log($("#map").text())
    expect($("#map").hasClass("leaflet-container")).toBe(true);
    expect($("#map").text()).toMatch(/.*MIERUNE.*/);
  });
})