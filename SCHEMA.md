# The WebRTC Sphero Communication Schema **Work in Progress**

## Operational Modes and Valid Schemas

There are three different operational modes
* Driving
* Calibration

There are four different communication schemas:
* SetMode
* Text
* Drive
* Heading
* Color

Each schema is only valid in specific modes, otherwise the message is ignored.

Once the device is switched into `drive` mode, only `heading` messages are invalid.
When entered into `calibrate`, only `setmode`, `heading`, and `text` messages and valid.

## Schema Documentation
**Note:** Anything using `<` and `>` below is a placeholder.
### SetMode
```JSON
{
	type: "setmode",
	mode: "<drive, or calibrate>"
}
```

### Text

```JSON
{
	type: "text",
	body: "<body of message>"
}
```

### Drive
```JSON
{
	type: "drive",
	heading: "<angle, from 0-359>",
	speed: "<speed from 0-255>"
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
