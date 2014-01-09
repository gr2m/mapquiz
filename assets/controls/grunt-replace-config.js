// The controls to select the correct answer
// on the screen is SVG. The workflow is as follows:
//
// 1. Make adjustments in `controls.sketch`
// 2. export the buttons to `controls.svg`
// 3. run `grunt replace:svg`
//
// This will update `src/app/templates.html` based
// on `controls.svg`
module.exports =
{
  src: ['assets/controls/controls.svg'],
  dest: 'src/app/templates/controls.html',
  replacements: [{
    // remove <xml> tag
    from: /<\?xml[^>]+>\s*/,
    to: ''
  },{
    // remove <title> tag
    from: /<title>.*<\/title>\n/,
    to: ''
  },{
    // remove <description> tag
    from: /<description>.*<\/description>\n/,
    to: ''
  },{
    // remove <title> tag
    from: /<defs>.*<\/defs>\n/,
    to: ''
  }, {
    // remove unneeded outer g tags 1/2
    from: /<g[^>]+>\s*<g[^>]+>\n/,
    to: ''
  },{
    // remove unneeded outer g tag 2/2
    from: /<\/g>\s*<\/g>\s*<\/g>/,
    to: '</g>'
  },{
    // remove all the unneded attributes
    from: /(version|id|width|height|xmlns:xlink|xmlns:sketch|sketch:type|font-family|font-size|font-weight|opacity|sketch:alignment)="[^"]+"\s*/g,
    to: ''
  },{
    // add preserveAspectRatio attribute
    from: /<svg/,
    to: '<svg preserveAspectRatio="none"'
  },{
    // add new attributes: accesskey & data-control-id
    // this is one-by-one
    from: /<g transform="([^"]+)">/,
    to: '<g transform="$1" accesskey="{{items.0.id}}" data-control-id="{{items.0.id}}">'
  },{ from: /<g transform="([^"]+)">/, to: '<g transform="$1" accesskey="{{items.1.id}}" data-control-id="{{items.1.id}}">'
  },{ from: /<g transform="([^"]+)">/, to: '<g transform="$1" accesskey="{{items.2.id}}" data-control-id="{{items.2.id}}">'
  },{ from: /<g transform="([^"]+)">/, to: '<g transform="$1" accesskey="{{items.3.id}}" data-control-id="{{items.3.id}}">'
  },{
    // special treatment for the hint button
    from: /<g transform="([^"]+)">/,
    to: '<g transform="$1" accesskey="?" class="hint">'
  },{
    // add placeholder for 1st letter
    from: /<tspan x="(\d+)" y="(\d+)">A<\/tspan>/,
    to: '<tspan x="$1" y="$2">{{items.0.name}}</tspan>'
  },{
    // add placeholder for 2nd letter
    from: /<tspan x="(\d+)" y="(\d+)">B<\/tspan>/,
    to: '<tspan x="$1" y="$2">{{items.1.name}}</tspan>'
  },{
    // add placeholder for 3nd letter
    from: /<tspan x="(\d+)" y="(\d+)">C<\/tspan>/,
    to: '<tspan x="$1" y="$2">{{items.2.name}}</tspan>'
  },{
    // add placeholder for 4nd letter
    from: /<tspan x="(\d+)" y="(\d+)">D<\/tspan>/,
    to: '<tspan x="$1" y="$2">{{items.3.name}}</tspan>'
  },
  //   // beautifications
  { from: /  {20,}/g, to: '    '},
  { from: /            /g, to: '    '}
  ]
};
