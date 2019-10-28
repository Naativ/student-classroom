const https = require('https')
const fs = require('fs')
const { StringDecoder } = require('string_decoder')
const translationsApiUrl = 'https://api.sheety.co/7c99e08c-2ec2-4a7b-8d89-be0a8709e416'
const decoder = new StringDecoder('utf8')

const process = (translations) => {
  const t = {}
  translations.forEach(key => {
    for (var i in key) {
      if (key.hasOwnProperty(i)) {
        let i18nKey = key.key
        if (i !== 'key' && key[i]) {
          if (t[i.toLowerCase()]) {
            t[i.toLowerCase()][i18nKey] = key[i]
          } else {
            t[i.toLowerCase()] = {
              [i18nKey]: key[i]
            }
          }
        }
      }
    }
  })

  for (var lang in t) {
    fs.writeFile(`./src/lang/${lang}.json`, JSON.stringify(t[lang], null, 2), function(err) {
      if (err) {
        return console.log(err)
      }

      console.log('tranlsation saved')
    })
  }
}

https.get(translationsApiUrl, (res) => {
  let rawData = ''
  res.on('data', (d) => {
    rawData += decoder.write(d)
  })

  res.on('end', () => {
    const data = JSON.parse(rawData)
    process(data)
  })
})
