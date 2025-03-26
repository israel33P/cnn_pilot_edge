# An exploration to build a framework for VizRT Pilot Edge
*Author: Israel*
## Based of - Basic VizRT framework

This is a vue typescript framework using vite as a bundler.

We will be pulling some key elments from the original Vizrt client
side framework provided by viz.
> payloadHosing.js
>
> PayloadHelper

## Added Components
This is a list of the available components

**- TextBox**

-- List of Properties:
> **field**: Type of value: number. This is the name of the field in viz's template builder you are trying to link to. For this, it should be a string field.
>
> **value**: Type of value: string. This is the output value. Only use this propirty if you are trying to set a default value.
>
> **maxLines**: Default: 1. Type of value: number. This is the max number of lines you can write in. The textbox will auto size in height based on this value, unless heightByLines is used (this will overwrite the height value).
>
> **heightByLines**: Type of value: number. This will set the height of the textBox by line amount. This property can not be used if maxLines is not set or set to 1.
>
> **label**: Type of value: string. This is a label that will follow the textbox.
>
> **labelPosition**: Default: 'left'. Type of value: string('top', 'bottom', 'left', 'right'). This is the position of the label. This property can not be used if label is not set.
>
> **capitalized**: Default: false. Type of value: string
> > 'true' & 'characters': All Caps
> 
> > 'words': The start of every word is Cap
>
> > 'sentences': The start of every sentence is Caped
>
> > 'none' & 'false': No auto Caps
>
> **guides**: Default: empty. Type of value: Array[object]
> > position: Default: 0. Type: number. The position of the guide line. Zero being the left or top most position. The units are in pixles.
>
> > alignment: Default 'vertical'. Type: string('vertical' or 'horizontal'). This will set the alignment of the guide line across the textbox.
>
> > color: Default: white. Type: color as string. This is the color of the guide line.
> > - color: 'rgb(0, 0, 0)'  *spaces after (,) are needed
> > - color: 'rgba(0, 0, 0, 1)'  *spaces after(.) are needed
> > - color: '#FFF' or '#FFFFFF' or '#FFFFFFFF'

-- emit / event
> **numberOfLines**: Returns: number. This returns the amount of lines typed into a textbox. It triggers when a new line is added or removed.
 
**example**
```html
<TextBox field="Title"
            label-position="top"
            label="Title" 
            capitalize="true"
            @number-of-lines="onLineAmtChanged"
            :max-lines="3"
            :guides="[
              { position: 45, color: 'rgb(255, 0, 0)', alignment: 'horizontal' },
              { position: 155, color: '#4422DD' },
              { position: 255 }
            ]"
        />
```
```ts
// This is the function tracking the line amount change
...
  const onLineAmtChanged = (num: Number) => {
    console.log(num.toString())
  }
...
```


## Added Pages
This is a list of the available pages and a url to see them
- HeaderView: http://localhost:2235/header?dev=true