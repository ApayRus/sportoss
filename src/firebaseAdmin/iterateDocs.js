import admin from './admin.js'
import adminSDK from 'firebase-admin'

const db = admin.firestore()

const readCategoriesIntoOneDoc = () => {
  const categories = {}
  db.collection('categories')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const { gender, minAge, maxAge, weight } = doc.data()
        const { id } = doc
        categories[id] = { gender, minAge, maxAge, weight }
      })
      db.collection('categories')
        .doc('sibir')
        .set(categories)
    })
    .catch(error => {
      console.log('Error getting documents: ', error)
    })
}

const printCollection = collection => {
  db.collection(collection)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        console.log(JSON.stringify({ [doc.id]: doc.data() }, null, '\t'))
      })
    })
    .catch(error => {
      console.log('Error getting documents: ', error)
    })
}

const deleteCollection = collection => {
  db.collection(collection)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        if (doc.id !== 'sibir') {
          doc.ref.delete()
        }
      })
    })
    .catch(error => {
      console.log('Error getting documents: ', error)
    })
}

const readTrainersIntoOneDoc = () => {
  const trainers = {}
  db.collection('trainers')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const { familyName, fatherName, firstName } = doc.data()
        const { id } = doc
        trainers[id] = { familyName, fatherName, firstName }
      })
      db.collection('trainers')
        .doc('sibir')
        .set(trainers)
    })
    .catch(error => {
      console.log('Error getting documents: ', error)
    })
}

const showCategoriesForClub = clubId => {
  db.collection('categories')
    .doc(clubId)
    .get()
    .then(doc => {
      console.log(doc)
    })
    .catch(error => {
      console.log('Error getting documents: ', error)
    })
}

const deleteField = (collection, doc, fieldId) => {
  db.collection(collection)
    .doc(doc)
    .update({
      [fieldId]: adminSDK.firestore.FieldValue.delete()
    })
}

deleteCollection('categories')
// readCategoriesIntoOneDoc()
// printCollection('categories')
// deleteField('categories', 'sibir', 'EjIWtBg4c6')
// showCategoriesForClub('sibir')
// readTrainersIntoOneDoc()

/* 
// iterate materials by unit, and add some default meta
db.collection('material')
  .where('unit', '==', '***')
  .get()
  .then(querySnapshot => {
    querySnapshot.forEach(doc => {
      doc.ref.update({
        meta: {
          translations: ['ru'],
          created: {
            userId: '***',
            userName: '***',
            time: 1566164966501
          },
          updated: {
            userId: '***',
            userName: '***',
            time: 1566164966501
          }
        },
        createdAt: adminSDK.firestore.FieldValue.delete(),
        updatedAt: adminSDK.firestore.FieldValue.delete()
      })
    })
  })
  .catch(error => {
    console.log('Error getting documents: ', error)
  }) 
  */
