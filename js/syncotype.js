/*
Syncotype-Alt v1.6  Created by Rob Goodlatte.
Rewritten by Emmett Nicholas
Modified and updated by Samuel Mikel Bowles

This is currently a fork from the offical Syncotype created by Rob Goodlatte.
*/
var Syncotype = {
	Lines: {
		Color: 'red'
	},
	Box: {
		ID: 'syncotype_box'
	},
	Button: {
		ID: 'syncotype_button'
	},
	Offset: {
		ID: 'syncotype_offset',
		Default: 0
	},
	Spacing: {
		ID: 'syncotype_spacing',
		Default: 24,
		Min: 5
	}
};

Syncotype.Box.BoxObj = function()
{
	var div;
	div = document.createElement('div');
	div.id = Syncotype.Box.ID;
	div.style.position = 'absolute';
	div.style.right = '5px';
	div.style.top = '0';
	div.style.padding= '10px';
	div.style.color= '#fff';
	div.style.zIndex = '1000';
	div.style.backgroundColor = '#333';
	
	div.innerHTML = [

		'<p>Line Height:',
		'<input type="text" size="2" style="margin-left:10px; float:right;" id="', Syncotype.Spacing.ID, '" /></p>',
		'<p>Offset:',
		'<input type="text" value="0" size="2" style="margin-left:10px; float:right;" id="', Syncotype.Offset.ID, '" /></p>',
		'<input type="submit" value="Syncotype It!" onclick="Syncotype.lines.draw();" id="', Syncotype.Button.ID, '" />'
	].join('');	
	
	document.body.appendChild(div);
	Syncotype.setOffset(Syncotype.Offset.Default);
	Syncotype.setSpacing(Syncotype.Spacing.Default);
	
};

Syncotype.setSpacing = function(value)
{
	document.getElementById(Syncotype.Spacing.ID).value = value;
	return value;
};

Syncotype.setOffset =  function(value)
{
	document.getElementById(Syncotype.Offset.ID).value = value;
	return value;
};

Syncotype.Lines.LinesObj = function()
{
	var elements = [];

	this.draw = function(spacing, offset)
	{
		var i, span, button, box;
				
		if (spacing == null) {
			spacing = parseFloat(document.getElementById(Syncotype.Spacing.ID).value, 10);
			spacing = (!spacing || spacing < Syncotype.Spacing.Min) ? Syncotype.setSpacing(Syncotype.Spacing.Default) : spacing;
		}
		
		if (offset == null) {
			offset = parseFloat(document.getElementById(Syncotype.Offset.ID).value, 10);
			offset = (!offset || offset < 0) ? Syncotype.setOffset(Syncotype.Offset.Default) : offset;	
		}		
				
		button = document.getElementById(Syncotype.Button.ID);
		if (button)
		{
			box = document.getElementById(Syncotype.Box.ID);
			box.removeChild(button);
			box.innerHTML += [
				'<input type="submit" value="Redraw" onclick="Syncotype.lines.draw();" /> &nbsp;',
				'<input type="submit" value="Clear" onclick="Syncotype.lines.clear();" />'
			].join('');
			
			//Fix a Firefox peculiarity in which the inputs are cleared when appending innerHTML:
			Syncotype.setSpacing(spacing);
			Syncotype.setOffset(offset);
		}
		
		this.clear();
		for (i = offset; i < document.body.clientHeight; i += spacing)
		{
			span = document.createElement('span');
			span.style.position = 'absolute';
			span.style.left = '0px';
			span.style.top = i + 'px';
			span.style.width = '100%';
			span.style.height = '1px';
			span.style.backgroundColor = Syncotype.Lines.Color;
			span.style.fontSize = '0px';
			span.style.overflow = 'hidden';
			elements.push(document.body.appendChild(span));
		}
	};
	
	this.clear = function()
	{
		var elem;
		while (elements.length > 0)
		{
			elem = elements.shift();
			elem.parentNode.removeChild(elem);
		}
	};
};

Syncotype.combine = function combine(func1, func2)
{
	return function()
	{
		if (func1)
		{
			func1();
		}
		if (func2)
		{
			func2();
		}
	};
};

function cli()
{	if (document.location.href.match("#") && document.location.href.split("#")[1].match("syncotype")) {
		
		if(document.location.href.split("#")[1].match("syncotype-") != null) {

			var spacing = parseInt(document.location.href.split("#")[1].split("-")[1]);
			var offset = parseInt(document.location.href.split("#")[1].split("-")[2]);
			if (isNaN(offset)) { var offset = Syncotype.Offset.Default; }
			return [ spacing, offset ];
			
		} else {
			return "interactive";
		}			
	} else {
		return false;
	}
}

window.onload = Syncotype.combine(window.onload, function()
	{
		Syncotype.lines = new Syncotype.Lines.LinesObj();

		if (cli()=="interactive") {
			var box;		
			box = new Syncotype.Box.BoxObj();
		} else if (cli()) {
			Syncotype.lines.draw(cli()[0],cli()[1]);
		}

	}
);