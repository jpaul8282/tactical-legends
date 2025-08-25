@startjson
{
  "**legend**: character name":               ["**two-character escape sequence**", "example (between 'a' and 'b')"],
  "quotation mark character (U+0022)":        ["\\\"", "a\"b"],
  "reverse solidus character (U+005C)":       ["\\\\", "a\\b"],
  "solidus character (U+002F)":               ["\\/", "a\/b"],
  "backspace character (U+0008)":             ["\\b", "a\bb"],
  "form feed character (U+000C)":             ["\\f", "a\fb"],
  "line feed character (U+000A)":             ["\\n", "a\nb"],
  "carriage return character (U+000D)":       ["\\r", "a\rb"],
  "character tabulation character (U+0009)":  ["\\t", "a\tb"]
}
@endjson

public string GenerateEncodedInscription(string relicName, string origin, string eventTag)
{
    return $"\"{relicName}\"\\nForged in {origin}\\tDuring {eventTag}\\rBound by memory\\bNever forgotten";
}

{
  "relicName": "Stormcaller Matrix",
  "encodedInscription": "\"Stormcaller Matrix\"\nForged in Vaultborn+Eden\tDuring EchoStorm 7\rBound by memory\bNever forgotten"
}

{
  "transmissionID": "EL-442",
  "relicID": "VX-77",
  "payload": "EchoLink\\nRelic: \\\"VX-77\\\"\\tOrigin: Vaultborn\\rPrevious: Nyla Sera\\bCurrent: Echo-27"
}

public string BuildEchoLinkPayload(Relic relic)
{
    return $"EchoLink\\nRelic: \\\"{relic.id}\\\"\\tOrigin: {relic.origin}\\rPrevious: {string.Join(",", relic.previousOwners)}\\bCurrent: {relic.currentOwner}";
}

