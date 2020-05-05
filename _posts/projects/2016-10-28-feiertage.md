---
layout: post
category: project
title: "Feiertage"
date: 2016-10-28
---


Feiertage is a Go/Golang library for calculating German and Austrian bank holidays. It includes the calculation of the date of Easter and, more importantly, offers ways to retrieve public holidays for a state of Germany or Austria (=Bundesland).

The library is probably useful only for people implementing use cases with special requirements inside of Austria or Germany, such as shift schedules or capacity calculation.

**Feiertage covers the following _special dates_:**

||||
|----|-----|----|
`Neujahr` | `Epiphanias` | `HeiligeDreiKönige`
`Valentinstag`   | `InternationalerTagDesGedenkensAnDieOpferDesHolocaust`  | `Josefitag`
`Weiberfastnacht` |  `Karnevalssonntag` | `Rosenmontag`
`Fastnacht` | `Aschermittwoch` | `InternationalerFrauentag`
`Palmsonntag` | `Gründonnerstag` | `Karfreitag`
`Ostern` | `BeginnSommerzeit` | `Ostermontag`
`Walpurgisnacht` | `TagDerArbeit` | `TagDerBefreiung`
`Staatsfeiertag` | `InternationalerTagDerPressefreiheit` | `Florianitag`
`Muttertag` | `ChristiHimmelfahrt` | `Vatertag`
`Pfingsten` | `Pfingstmontag` | `Dreifaltigkeitssonntag`
`Fronleichnam` | `TagDesMeeres` | `MariäHimmelfahrt`
`Rupertitag` | `InternationalerKindertag`| `Weltflüchtlingstag` |
`TagDerDeutschenEinheit` | `TagDerVolksabstimmung` | `Nationalfeiertag`
`Erntedankfest` | `Reformationstag` | `Halloween`
`BeginnWinterzeit` | `Allerheiligen` | `Allerseelen`
`Martinstag` | `Karnevalsbeginn` | `Leopolditag`
`Weltkindertag` | `BußUndBettag` | `Thanksgiving`
`Blackfriday` |`Volkstrauertag` | `Nikolaus`
`MariäUnbefleckteEmpfängnis` | `MariäEmpfängnis` | `Totensonntag`
`ErsterAdvent` | `ZweiterAdvent` | `DritterAdvent`
`VierterAdvent` | `Heiligabend` | `Weihnachten`
`Christtag` | `Stefanitag` | `ZweiterWeihnachtsfeiertag`
`Silvester` | &nbsp; | &nbsp;


**Feiertage covers the public holidays defined for these states (_Bundesländer_):**

||||
----|-----|----
`BadenWürttemberg` | `Bayern` | `Berlin`
`Brandenburg` | `Bremen` | `Hamburg`
`Hessen` | `MecklenburgVorpommern` | `Niedersachsen`
`NordrheinWestfalen` | `RheinlandPfalz` | `Saarland`
`Sachsen` | `SachsenAnhalt` | `SchleswigHolstein`
`Thüringen` | `Deutschland` | `Burgenland`
`Kärnten` | `Niederösterreich` | `Oberösterreich`
`Salzburg` | `Steiermark` | `Tirol`
`Vorarlberg` | `Wien` | `Österreich`
`All` | &nbsp; | &nbsp;



### Examples:

```golang
fmt.Println(Ostern(2016))
--> 27.03.2016 Ostern


    fmt.Println(BußUndBettag(2016))
    --> 16.11.2016 Buß- und Bettag



fmt.Println(Brandenburg(2016))
--> Brandenburg (BB)
    01.01.2016 Neujahr
    25.03.2016 Karfreitag
    27.03.2016 Ostern
    28.03.2016 Ostermontag
    01.05.2016 Tag der Arbeit
    05.05.2016 Christi Himmelfahrt
    15.05.2016 Pfingsten
    16.05.2016 Pfingstmontag
    03.10.2016 Tag der deutschen Einheit
    31.10.2016 Reformationstag
    25.12.2016 Weihnachten
    26.12.2016 Zweiter Weihnachtsfeiertag
```

## Command line tool

A little command line tool is included as well. It can be compiled using `make buildcmd` or `go build cmd/feiertage/feiertage.go` This will create an executable `feiertage`.

See https://github.com/wlbr/feiertage/releases/latest for downloads.


```shell
$ feiertage -region baden-württemberg 2021
-->
Baden-Württemberg (BW)
  01.01.2021 Neujahr
  06.01.2021 Epiphanias
  02.04.2021 Karfreitag
  05.04.2021 Ostermontag
  01.05.2021 Tag der Arbeit
  13.05.2021 Christi Himmelfahrt
  24.05.2021 Pfingstmontag
  03.06.2021 Fronleichnam
  03.10.2021 Tag der deutschen Einheit
  01.11.2021 Allerheiligen
  25.12.2021 Weihnachten
  26.12.2021 Zweiter Weihnachtsfeiertag
```

<br>
<hr>
<br>

Just for my old collegues: the commandline tool can generate Taskjuggler code instead of plain text. See below:

```shell
$ feiertage -region bw -asTasjugglerCode 2021
-->
# public holidays for Baden-Württemberg (BW),
 leaves holiday "Neujahr" 2021-01-01,
 leaves holiday "Epiphanias" 2021-01-06,
 leaves holiday "Karfreitag" 2021-04-02,
 leaves holiday "Ostermontag" 2021-04-05,
 leaves holiday "Tag der Arbeit" 2021-05-01,
 leaves holiday "Christi Himmelfahrt" 2021-05-13,
 leaves holiday "Pfingstmontag" 2021-05-24,
 leaves holiday "Fronleichnam" 2021-06-03,
 leaves holiday "Tag der deutschen Einheit" 2021-10-03,
 leaves holiday "Allerheiligen" 2021-11-01,
 leaves holiday "Weihnachten" 2021-12-25,
 leaves holiday "Zweiter Weihnachtsfeiertag" 2021-12-26
 ```

See [https://github.com/wlbr/feiertage](https://github.com/wlbr/feiertage) for details.
