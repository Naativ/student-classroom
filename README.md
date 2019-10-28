# classroom

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```

### Run your end-to-end tests
```
npm run test:e2e
```

## Adding a new translation

- [ ] Find BCP 47 language code for new language
- [ ] Create migration in platform for new language
- [ ] Add new language object to languages in store.js
ie.
```
  ...
  { id: 7, code: 'th', locale: ['th-TH'], localName: 'ไทย' }
  ...
```
- [ ] Create new translation in translation spreadsheet
- [ ] Import moment js locale in store.js
- [ ] Update processor
- [ ] Create emails in sendgrid
- [ ] Run `npm run update:translations`
