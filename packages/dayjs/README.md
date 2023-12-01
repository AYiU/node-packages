# DayJs

Plugin for dayjs.

## Install

```
import dayjs from "dayjs";
import Plugin from "@yiuayiu/dayjs";

dayjs.extend(Plugin);

```

## Functions

```
dayjs().formatDate(defaultValue?: string): string;
```

If date is valid, return format date YYYY-MM-DD HH:mm, else return defaultValue.

```
dayjs().fromNowX(defaultValue?: string): string;
```

If date is valid, return fromNow() function, else return defaultValue.

```
dayjs().displayDateOrTime(): string;
```

If current time - value in dayjs is > 24 hours, return format date YYYY-MM-DD, else return format HH:mm.

```

```
