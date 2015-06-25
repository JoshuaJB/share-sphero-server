# The WebRTC Sphero Communication Schema **Work in Progress**

## Operational Modes and Valid Schemas

There are three different operational modes
* Setup
* Driving
* Calibration

There are four different communication schemas:
* SetMode
* Text
* Drive
* Heading
* Color

Each schema is only valid in specific modes, otherwise the message is ignored.

The starting mode is always `setup`. Only `setmode` and `text` messages are used here.
Once the device is switched into `drive` mode, only `heading` messages are invalid.
When entered into `calibrate`, only `setmode`, `heading`, and `text` messages and valid.

## Schema Documentation
**Note:** Anything using `<` and `>` below is a placeholder.
### SetMode
```JSON
{
	type: "setmode",
	name: "<username>",
	mode: "<setup, drive, or calibrate>"
}
```

### Text

```JSON
{
	type: "text",
	from: "<username>",
	body: "<body of message>"
}
```

### Drive
```JSON
{
	type: "drive",
	heading: "<angle, from 0-359>",
	speed: "<speed above 0>"
}
```

### Heading
```JSON
{
	type: "heading",
	heading: "<angle, from 0-359>"
}
```

### Color
```JSON
{
	type: "color",
	color: "<color value from #000000-#FFFFFF>"
}
