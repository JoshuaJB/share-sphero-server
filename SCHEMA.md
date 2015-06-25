# The WebRTC Sphero Communication Schema *Work in Progress*

## Operational Modes and Valid Schemas

There are three different operational modes
* Setup
* Driving
* Calibration

There are four different communication schemas:
* Text Message
* Drive
* Heading
* Color
* SetMode
Each schema is only valid in specific modes, otherwise the message is ignored.

The starting mode is always `setup`. Only `setmode` and `text` messages are used here.
Once the device is switched into `drive` mode, only `heading` messages are invalid.
When entered into `calibrate`, only `setmode`, `heading`, and `text` messages and valid.

## Schema Documentation
*Note:* Anything using `<` and `>` below is a placeholder.
### SetMode
The initial mode that the server assigns to new connections is the setup state.
Mode Command Sets
Setup: SetMode, Text
Drive: SetMode, Text, Drive, Color
Calibrate: SetMode, Heading
```JSON
{
	schema: "setmode",
	name: "<username>",
	mode: "<setup, drive, or calibrate>"
}
```

### Text Message

```JSON
{
	schema: "text",
	frome: "<username>",
	body: "<body of message>"
}
```

### Drive
```JSON
{
	schema: "drive",
	heading: "<angle, from 0-359>",
	speed: "<speed above 0>"
}
```

### Heading
```JSON
{
	schema: "heading",
	heading: "<angle, from 0-359>"
}
```

### Color
```JSON
{
	schema: "color",
	color: "<color value from #000000-#FFFFFF>"
}
