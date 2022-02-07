import namor from 'namor';

const range = len => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = () => {
  const statusChance = Math.random();
  const sourceChance = Math.random();
  var index = 1
  return {
    firstName: namor.generate({ words: 1, numbers: 0 }),
    lastName: namor.generate({ words: 1, numbers: 0 }),
    age: Math.floor(Math.random() * 30),
    visits: Math.floor(Math.random() * 30)+ '-'+Math.floor(Math.random() * 12)+'-2021',
    number: index = index+1,
    cheque: Math.floor(Math.random() * 100000000),
    qr: Math.floor(Math.random() * 1000000),
    progress: Math.floor(Math.random() * 100),
    status:
      statusChance > 0.5
        ? 'Unprocessed'
        : 'Unprocessed',
    source:
      sourceChance > 0.5
        ? 'Mobile'
        : 'CDK',
  }
}

export default function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth]
    return range(len).map(d => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}