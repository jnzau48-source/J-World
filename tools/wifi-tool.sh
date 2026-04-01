#!/data/data/com.termux/files/usr/bin/bash

echo "📡 J-WORLD WIFI RADAR"
echo "----------------------------------"

termux-wifi-scaninfo | jq -r '
sort_by(.rssi) | reverse |
.[] |
(
  if .ssid == "" then "Hidden Network"
  else .ssid end
) as $name |

(
  if (.capabilities | contains("WPA") or contains("WEP"))
  then "🔒 Secured"
  else "⚠️ Open"
  end
) as $security |

"📶 \($name) | Signal: \(.rssi)dBm | \($security)"
'

echo "----------------------------------"
echo "✅ Scan complete"
