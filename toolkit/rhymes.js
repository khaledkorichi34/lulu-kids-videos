// Traditional nursery rhymes in the public domain: words and melodies are all older than 1900.
// Each line is a list of [syllable, note, beats]. A syllable ending in "-" joins the next one
// ("Twin-" + "kle," shows as "Twinkle,"). One beat = one quarter note; bpm is a sensible default.
// Only add a rhyme here when BOTH the words and the tune are traditional and older than 1929,
// and you are sure of every note. This file is read by lib.js (lyrics) and audio.py (music).
const RHYMES = {
  "twinkle": {
    "title": "Twinkle, Twinkle, Little Star",
    "source": "Words by Jane Taylor (1806); traditional French tune (1761)",
    "bpm": 92,
    "lines": [
      [["Twin-","C5",1],["kle,","C5",1],["twin-","G5",1],["kle,","G5",1],["lit-","A5",1],["tle","A5",1],["star,","G5",2]],
      [["How","F5",1],["I","F5",1],["won-","E5",1],["der","E5",1],["what","D5",1],["you","D5",1],["are!","C5",2]],
      [["Up","G5",1],["a-","G5",1],["bove","F5",1],["the","F5",1],["world","E5",1],["so","E5",1],["high,","D5",2]],
      [["Like","G5",1],["a","G5",1],["dia-","F5",1],["mond","F5",1],["in","E5",1],["the","E5",1],["sky.","D5",2]],
      [["Twin-","C5",1],["kle,","C5",1],["twin-","G5",1],["kle,","G5",1],["lit-","A5",1],["tle","A5",1],["star,","G5",2]],
      [["How","F5",1],["I","F5",1],["won-","E5",1],["der","E5",1],["what","D5",1],["you","D5",1],["are!","C5",2]]
    ]
  },
  "row": {
    "title": "Row, Row, Row Your Boat",
    "source": "Traditional (1852)",
    "bpm": 96,
    "lines": [
      [["Row,","C5",1.5],["row,","C5",1.5],["row","C5",1],["your","D5",0.5],["boat","E5",1.5]],
      [["Gent-","E5",1],["ly","D5",0.5],["down","E5",1],["the","F5",0.5],["stream.","G5",3]],
      [["Mer-","C6",0.5],["ri-","C6",0.5],["ly,","C6",0.5],["mer-","G5",0.5],["ri-","G5",0.5],["ly,","G5",0.5],["mer-","E5",0.5],["ri-","E5",0.5],["ly,","E5",0.5],["mer-","C5",0.5],["ri-","C5",0.5],["ly,","C5",0.5]],
      [["Life","G5",1],["is","F5",0.5],["but","E5",1],["a","D5",0.5],["dream.","C5",3]]
    ]
  },
  "mary": {
    "title": "Mary Had a Little Lamb",
    "source": "Words by Sarah Josepha Hale (1830); traditional tune",
    "bpm": 108,
    "lines": [
      [["Ma-","E5",1],["ry","D5",1],["had","C5",1],["a","D5",1],["lit-","E5",1],["tle","E5",1],["lamb,","E5",2]],
      [["lit-","D5",1],["tle","D5",1],["lamb,","D5",2],["lit-","E5",1],["tle","G5",1],["lamb,","G5",2]],
      [["Ma-","E5",1],["ry","D5",1],["had","C5",1],["a","D5",1],["lit-","E5",1],["tle","E5",1],["lamb,","E5",1]],
      [["its","E5",1],["fleece","D5",1],["was","D5",1],["white","E5",1],["as","D5",1],["snow.","C5",4]]
    ]
  },
  "london": {
    "title": "London Bridge Is Falling Down",
    "source": "Traditional (1744)",
    "bpm": 112,
    "lines": [
      [["Lon-","G5",1.5],["don","A5",0.5],["Bridge","G5",1],["is","F5",1],["fall-","E5",1],["ing","F5",1],["down,","G5",2]],
      [["fall-","D5",1],["ing","E5",1],["down,","F5",2],["fall-","E5",1],["ing","F5",1],["down,","G5",2]],
      [["Lon-","G5",1.5],["don","A5",0.5],["Bridge","G5",1],["is","F5",1],["fall-","E5",1],["ing","F5",1],["down,","G5",2]],
      [["my","D5",2],["fair","G5",2],["la-","E5",1],["dy!","C5",3]]
    ]
  },
  "hotcross": {
    "title": "Hot Cross Buns",
    "source": "Traditional (1798)",
    "bpm": 104,
    "lines": [
      [["Hot","E5",1],["cross","D5",1],["buns!","C5",2]],
      [["Hot","E5",1],["cross","D5",1],["buns!","C5",2]],
      [["One","C5",0.5],["a","C5",0.5],["pen-","C5",0.5],["ny,","C5",0.5],["two","D5",0.5],["a","D5",0.5],["pen-","D5",0.5],["ny,","D5",0.5]],
      [["hot","E5",1],["cross","D5",1],["buns!","C5",2]]
    ]
  },
  "brotherjohn": {
    "title": "Are You Sleeping? (Brother John)",
    "source": "Traditional (18th century); English words 19th century",
    "bpm": 104,
    "lines": [
      [["Are","C5",1],["you","D5",1],["sleep-","E5",1],["ing,","C5",1]],
      [["are","C5",1],["you","D5",1],["sleep-","E5",1],["ing,","C5",1]],
      [["Bro-","E5",1],["ther","F5",1],["John?","G5",2]],
      [["Bro-","E5",1],["ther","F5",1],["John?","G5",2]],
      [["Morn-","G5",0.5],["ing","A5",0.5],["bells","G5",0.5],["are","F5",0.5],["ring-","E5",1],["ing,","C5",1]],
      [["morn-","G5",0.5],["ing","A5",0.5],["bells","G5",0.5],["are","F5",0.5],["ring-","E5",1],["ing,","C5",1]],
      [["ding,","C5",1],["dang,","G4",1],["dong!","C5",2]],
      [["Ding,","C5",1],["dang,","G4",1],["dong!","C5",2]]
    ]
  }
};
