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

const deleteDocs = collection => {
  db.collection(collection)
    .where('tournamentId', '==', 'HygcLVxYaW4570oAcRWg')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        doc.ref.delete()
      })
    })
    .catch(error => {
      console.log('Error getting documents: ', error)
    })
}

const iterateDocs = collection => {
  db.collection(collection)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const doForEachDoc = doc => {
          const { createdBy } = doc.data()
          const { userId, userName } = createdBy
          const created = { userId, userName, time: '1568984400000' }
          doc.ref.set(
            {
              fromUserId: userId,
              created,
              createdBy: adminSDK.firestore.FieldValue.delete(),
              updatedBy: adminSDK.firestore.FieldValue.delete()
            },
            { merge: true }
          )
        }
        doForEachDoc(doc)
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

const readAthletsIntoDocByTrainer = () => {
  const athlets = [] // { trainerId: {athletId: {}},  }
  db.collection('athlets')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const { gender, familyName, firstName, fatherName, birthday, createdBy } = doc.data()
        const { id: athletId } = doc
        const { userId, userName } = createdBy // it is a trainer
        const athlet = {
          gender,
          familyName,
          firstName,
          fatherName,
          birthday,
          created: { userId, userName }
        }
        athlets.push(athlet)
      })
      console.log(JSON.stringify(athlets, null, '\t'))
      /*db.collection('categories')
        .doc('sibir')
        .set(categories) */
    })
    .catch(error => {
      console.log('Error getting documents: ', error)
    })
}

const writeAthletesOneDocForOneTrainer = () => {
  const athletes = [
    {
      userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
      club: 'sibir',
      athletes: {
        '02Czbvb9a86a6Kp4oU7Y': {
          gender: 'Муж',
          familyName: 'Рыбалов',
          firstName: 'Данил',
          fatherName: 'Викторович',
          birthday: '2010-12-15',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        '07L7SigQR4Lt4J8ksln7': {
          gender: 'Муж',
          familyName: 'Осипкин',
          firstName: 'Савелий',
          fatherName: 'Игоревич',
          birthday: '2010-02-21',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        '0hynLbm6UMGjQzXhqit1': {
          gender: 'Жен',
          familyName: 'Гусарова',
          firstName: 'Екатерина',
          fatherName: 'Владимировна',
          birthday: '2010-04-17',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        '1MzU4jqQi30SPfUu2CqC': {
          gender: 'Муж',
          familyName: 'Журович',
          firstName: 'Роман',
          fatherName: 'Александрович',
          birthday: '2008-11-22',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        '1SvvQDlXWJNACTZigeDP': {
          gender: 'Муж',
          familyName: 'Журавлёв',
          firstName: 'Захар',
          fatherName: 'Владимирович',
          birthday: '2010-04-06',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        '2A6nCRL3Tf8VoA3QnYmg': {
          gender: 'Муж',
          familyName: 'Серюков',
          firstName: 'Фёдор',
          fatherName: 'Никитич',
          birthday: '2007-12-03',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        '3nJqDfVAPnpZggO33GOB': {
          gender: 'Муж',
          familyName: 'Петров',
          firstName: 'Никита',
          fatherName: 'Владимирович',
          birthday: '2007-03-02',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        '5tQWvM4aGRnAgek4eZ19': {
          gender: 'Муж',
          familyName: 'Орлов',
          firstName: 'Роман',
          fatherName: 'Евгеньевич',
          birthday: '2008-11-18',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        '63RNxzjaeNLvuJNk3Q4v': {
          gender: 'Жен',
          familyName: 'Осипова',
          firstName: 'Валентина',
          fatherName: '',
          birthday: '2010-05-29',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        '6mwuTnSesYessPZZIqL6': {
          gender: 'Жен',
          familyName: 'Воронова',
          firstName: 'Ирина',
          fatherName: 'Викторовна',
          birthday: '2006-03-03',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        '9kktXfsp8BIj9HFsaUHC': {
          gender: 'Муж',
          familyName: 'Анохин',
          firstName: 'Дмитрий',
          fatherName: 'Андреевич',
          birthday: '2005-06-02',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        Bk41saCbP8dk5Idd7woc: {
          gender: 'Муж',
          familyName: 'Антопольский',
          firstName: 'Евгений',
          fatherName: 'Вадимович',
          birthday: '2006-11-10',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        C4QVjXcet5kQ7XSvTPLY: {
          gender: 'Жен',
          familyName: 'Кухтина',
          firstName: 'Мирослава',
          fatherName: 'Евгеньевна',
          birthday: '2008-01-10',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        Dyb0cD4nxhfCuVzR8pFI: {
          gender: 'Муж',
          familyName: 'Сизиков',
          firstName: 'Даниил',
          fatherName: 'Андреевич',
          birthday: '2008-09-08',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        EAeCTuVZRM5IW3wZHs7W: {
          gender: 'Муж',
          familyName: 'Меньшиков',
          firstName: 'Владимир',
          fatherName: 'Витальевич',
          birthday: '2011-01-25',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        EbsqF9XPYakOohOP3pVF: {
          gender: 'Жен',
          familyName: 'Меньшикова',
          firstName: 'Анастасия',
          fatherName: 'Витальевна',
          birthday: '2006-05-23',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        GTJJtg1g9cuwnsiDfAB8: {
          gender: 'Муж',
          familyName: 'Боков',
          firstName: 'Егор',
          fatherName: 'Алексеевич',
          birthday: '2009-09-17',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        JWnNAMGuV6xfnSdTt9Dc: {
          gender: 'Жен',
          familyName: 'Рахмонова',
          firstName: 'Самира',
          fatherName: 'Алишеровна',
          birthday: '2006-05-27',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        MDowOc6fTABaCsrZUkIT: {
          gender: 'Муж',
          familyName: 'Тихонов',
          firstName: 'Вячеслав',
          fatherName: 'Денисович',
          birthday: '2006-10-25',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        MPW3xRswiYg7qQtfAIEl: {
          gender: 'Муж',
          familyName: 'Вергазов',
          firstName: 'Иван',
          fatherName: 'Сергеевич',
          birthday: '2009-03-31',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        MVY25cSckzoJBaxhELVa: {
          gender: 'Жен',
          familyName: 'Загревская',
          firstName: 'Варвара',
          fatherName: 'Максимовна',
          birthday: '2011-02-22',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        NkGwtLzCZZDCOfaJ0bNa: {
          gender: 'Муж',
          familyName: 'Мартынов',
          firstName: 'Артём',
          fatherName: 'Андреевич',
          birthday: '2007-07-09',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        NkQddrUeKZ4tjD5FjWqB: {
          gender: 'Муж',
          familyName: 'Овчаров',
          firstName: 'Вениамин',
          fatherName: 'Олегович',
          birthday: '2006-06-23',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        PT6lUlLVbvWQFLX3RH2C: {
          gender: 'Жен',
          familyName: 'Мозель',
          firstName: 'Екатерина',
          fatherName: 'Андреевна',
          birthday: '1998-11-04',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        R1ADiiwdK7pEUKK1HhVs: {
          gender: 'Муж',
          familyName: 'Семёнов',
          firstName: 'Сергей',
          fatherName: 'Романович',
          birthday: '2011-07-22',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        R2Hl4NNSLj9YGoaXh20k: {
          gender: 'Жен',
          familyName: 'Баева',
          firstName: 'Мария',
          fatherName: 'Анатольевна',
          birthday: '2011-02-01',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        SAlzXe8WQwSEoaBhJTYw: {
          gender: 'Муж',
          familyName: 'Федулов',
          firstName: 'Евгений',
          fatherName: 'Владиславович',
          birthday: '2011-05-28',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        TnXA7qaUk0QlUvxL8k7T: {
          gender: 'Муж',
          familyName: 'Костенко',
          firstName: 'Александр',
          fatherName: 'Николаевич',
          birthday: '2009-04-15',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        TzLajQ9AJJG6MymbojFl: {
          gender: 'Муж',
          familyName: 'Абу-Джабаль',
          firstName: 'Исмаил',
          fatherName: 'Ашраф',
          birthday: '2009-05-19',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        Ul2SzMiMEFP0Uiu871Q3: {
          gender: 'Жен',
          familyName: 'Вергазова',
          firstName: 'Анна',
          fatherName: 'Сергеевна',
          birthday: '2009-03-31',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        VCODzhYRILSoYsyG1hH6: {
          gender: 'Муж',
          familyName: 'Семёнов',
          firstName: 'Сергей',
          fatherName: 'Романович',
          birthday: '2001-07-22',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        XaXXUrmCOTQJtzpPCRD7: {
          gender: 'Муж',
          familyName: 'Мельников',
          firstName: 'Кирилл',
          fatherName: 'Евгеньевич',
          birthday: '2009-02-04',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        Y7pcqmNmuJHitpcC4bBP: {
          gender: 'Муж',
          familyName: 'Морозов',
          firstName: 'Данил',
          fatherName: 'Григорьевич',
          birthday: '2010-05-31',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        ZCfVryAORIdKt4KZsw6f: {
          gender: 'Муж',
          familyName: 'Вальчиков',
          firstName: 'Антон',
          fatherName: 'Анатольевич',
          birthday: '2005-05-26',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        fRNudL2yYZQ3ByXsFUl6: {
          gender: 'Жен',
          familyName: 'Попадейкина',
          firstName: 'Виктория',
          fatherName: 'Андреевна',
          birthday: '2008-07-02',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        herkGXNf9HveimK0NhAw: {
          gender: 'Муж',
          familyName: 'Вагнер',
          firstName: 'Георгий',
          fatherName: 'Александрович',
          birthday: '2007-02-04',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        iQu0bDAc4VBfYqIAxAMC: {
          gender: 'Жен',
          familyName: 'Лысак',
          firstName: 'Алина',
          fatherName: 'Павловна',
          birthday: '2007-03-16',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        k693ae3iSxQRI61d99MF: {
          gender: 'Жен',
          familyName: 'Соломенникова',
          firstName: 'Настасья',
          fatherName: 'Станиславовна',
          birthday: '2007-03-10',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        m9ioZ7gxpeKfdQb3XxMf: {
          gender: 'Муж',
          familyName: 'Молявкин',
          firstName: 'Роман',
          fatherName: 'Юрьевич',
          birthday: '2005-03-15',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        oSS1LXjugv3JTtKVRUac: {
          gender: 'Жен',
          familyName: 'Гусарова',
          firstName: 'Екатерина',
          fatherName: 'Владимировна',
          birthday: '2010-04-17',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        pHK8jBhGnUGw642zIzI7: {
          gender: 'Жен',
          familyName: 'Горохова',
          firstName: 'Варвара',
          fatherName: 'Александровна',
          birthday: '2010-12-16',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        sNmDVMTMDwXuWpmUe88o: {
          gender: 'Муж',
          familyName: 'Александров',
          firstName: 'Евгений',
          fatherName: 'Петрович',
          birthday: '2010-12-17',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        uBQYgbfr5RQMsBLvVn6J: {
          gender: 'Жен',
          familyName: 'Дёмина',
          firstName: 'Ирина',
          fatherName: 'Андреевна',
          birthday: '2006-09-04',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        vjMwUorv7rxIFPl1dgnS: {
          gender: 'Муж',
          familyName: 'Балыкшев',
          firstName: 'Арсений',
          fatherName: 'Игоревич',
          birthday: '2004-08-19',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        vq3T7b3hqNvKhQ1QWqGC: {
          gender: 'Муж',
          familyName: 'Логинов',
          firstName: 'Алексей',
          fatherName: 'Алексеевич',
          birthday: '2006-10-04',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        yJ8Xi2QShGXZU7hOr18V: {
          gender: 'Жен',
          familyName: 'Черненькая',
          firstName: 'Ульяна',
          fatherName: 'Витальевна',
          birthday: '2006-02-02',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        zN3L2bQbTt7hdUOJ51i5: {
          gender: 'Жен',
          familyName: 'Зубенкова',
          firstName: 'Галина',
          fatherName: 'Андреевна',
          birthday: '2001-07-20',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        },
        zPkOmGSydLy1WwbiRxlU: {
          gender: 'Муж',
          familyName: 'Заднепровский',
          firstName: 'Виталий',
          fatherName: 'Олегович',
          birthday: '2006-11-14',
          created: {
            userId: 'XUyqbTFLzfhEdLYpGHcudNgszor1',
            userName: 'nesteruk'
          }
        }
      }
    },
    {
      userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
      club: 'sibir',
      athletes: {
        '07xd5V85tZXwHHOWoPlZ': {
          gender: 'Жен',
          familyName: 'Окушко',
          firstName: 'Дарья',
          fatherName: '',
          birthday: '2008-12-10',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        '1AirLJSQeZEmF4QmUVnF': {
          gender: 'Муж',
          familyName: 'Русских',
          firstName: 'Александр',
          fatherName: 'Алексеевич',
          birthday: '2003-06-09',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        '1W7qS6NXFqTtbdtplLiC': {
          gender: 'Жен',
          familyName: 'Скворцова',
          firstName: 'Анна',
          fatherName: 'Викторовна',
          birthday: '1999-08-12',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        '4M869AMEcJDgf0lqomOt': {
          gender: 'Муж',
          familyName: 'Ломакин',
          firstName: 'Дмитрий',
          fatherName: '',
          birthday: '2008-12-14',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        '4qOezfYNaTUi5V4IsUFG': {
          gender: 'Жен',
          familyName: 'Гребенщикова',
          firstName: 'Софья',
          fatherName: '',
          birthday: '2010-02-16',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        '5LJY2CpENoHEcTBaNirQ': {
          gender: 'Жен',
          familyName: 'Насибова',
          firstName: 'Тамила',
          fatherName: '',
          birthday: '2005-07-19',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        '5ZEdmLTp0aKdjdirKnR5': {
          gender: 'Муж',
          familyName: 'Комаров',
          firstName: 'Кирилл',
          fatherName: 'Евгеньевич',
          birthday: '2006-06-24',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        '5ZM87zMAmAm0Z2HUKHlj': {
          gender: 'Жен',
          familyName: 'Мельникова',
          firstName: 'Софья',
          fatherName: '',
          birthday: '2007-11-08',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        '6LSvIn8X1hdQBhErNhZ0': {
          gender: 'Муж',
          familyName: 'Шевченко',
          firstName: 'Артур',
          fatherName: '',
          birthday: '1999-05-14',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        '6mAIdBxsEUBXxA4cN7Ho': {
          gender: 'Муж',
          familyName: 'Насибов',
          firstName: 'Темур',
          fatherName: 'Фируддин оглы',
          birthday: '2001-10-08',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        '74megy7LX75IXVKGey4U': {
          gender: 'Муж',
          familyName: 'Бахмач',
          firstName: 'Даниил',
          fatherName: '',
          birthday: '2003-11-27',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        '7cnyWTBopPsgG4p6c6ar': {
          gender: 'Муж',
          familyName: 'Егоров',
          firstName: 'Роман',
          fatherName: '',
          birthday: '2006-07-15',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        '7kR4VtiuJ4rrOUnnmuJJ': {
          gender: 'Муж',
          familyName: 'Леднев',
          firstName: 'Егор',
          fatherName: '',
          birthday: '2011-11-01',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        '7laRGBuJkk5ncPRGBhjr': {
          gender: 'Жен',
          familyName: 'Пронина',
          firstName: 'Кира',
          fatherName: 'Михайловна',
          birthday: '2010-02-18',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        '8Ncc5llAy5WIHiBNVwBu': {
          gender: 'Муж',
          familyName: 'Цапенко',
          firstName: 'Артем',
          fatherName: 'Алексеевич',
          birthday: '2004-02-24',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        '8Xv3RYfyjHdOMKqZ3c9K': {
          gender: 'Жен',
          familyName: 'Черепанова',
          firstName: 'Алиса',
          fatherName: 'Юрьевна',
          birthday: '2006-01-21',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        '8fbmyBjv8D50uUhIlBHc': {
          gender: 'Жен',
          familyName: 'Толпарова',
          firstName: 'Елена',
          fatherName: '',
          birthday: '2010-05-05',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        B1ffkjeFNpkRWTcEZFnL: {
          gender: 'Жен',
          familyName: 'Новикова',
          firstName: 'Арина',
          fatherName: '',
          birthday: '2010-08-03',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        BtKUV9fpnWTOh19B8G87: {
          gender: 'Муж',
          familyName: 'Зинатулин',
          firstName: 'Артем',
          fatherName: '',
          birthday: '2006-07-18',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        CWUVcQkWDTiov4RhvVKY: {
          gender: 'Муж',
          familyName: 'Мананков',
          firstName: 'Григорий',
          fatherName: '',
          birthday: '2003-01-07',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        CeQGAqU0a1KLBYDyOBP7: {
          gender: 'Муж',
          familyName: 'Алексин',
          firstName: 'Дмитрий',
          fatherName: '',
          birthday: '2010-05-10',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        CprNrskeqzKj5EtCpf3w: {
          gender: 'Муж',
          familyName: 'Завьялов',
          firstName: 'Александр',
          fatherName: '',
          birthday: '2003-01-29',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        CzZ5DFn43jERc2JjGby7: {
          gender: 'Муж',
          familyName: 'Косенков',
          firstName: 'Андрей',
          fatherName: '',
          birthday: '2004-03-28',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        D8ue69HlI71GfI6PXWzQ: {
          gender: 'Муж',
          familyName: 'Галаганов',
          firstName: 'Илья',
          fatherName: '',
          birthday: '2007-12-27',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        E6AwVwHoFntFW7mQnG9v: {
          gender: 'Жен',
          familyName: 'Байкина',
          firstName: 'Дарья',
          fatherName: 'Михайловна',
          birthday: '2005-06-30',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        GALINgNPrGhufGTTSkbk: {
          gender: 'Муж',
          familyName: 'Сафронов',
          firstName: 'Кирилл',
          fatherName: 'Александрович',
          birthday: '2005-12-27',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        GokhJZa7pEs4TG3Mrwve: {
          gender: 'Жен',
          familyName: 'Чиняева',
          firstName: 'Виктория',
          fatherName: '',
          birthday: '2003-09-04',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        Hx4fNbzLENnjNpBZHN7B: {
          gender: 'Муж',
          familyName: 'Харитонов',
          firstName: 'Илья',
          fatherName: '',
          birthday: '2005-03-19',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        KDSQI57k4hvHfASp8bCg: {
          gender: 'Муж',
          familyName: 'Апаев',
          firstName: 'Ислам',
          fatherName: 'Русланович',
          birthday: '2010-12-27',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        KiKBngoVxR5puWpNWRsf: {
          gender: 'Муж',
          familyName: 'Баздырев',
          firstName: 'Александр',
          fatherName: '',
          birthday: '2004-03-22',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        KpjjXfOyJXup8nKb9tBO: {
          gender: 'Жен',
          familyName: 'Пронина',
          firstName: 'Алина',
          fatherName: 'Михайловна',
          birthday: '2006-10-01',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        LRkaLfiqHvqZGK1jkPM9: {
          gender: 'Муж',
          familyName: 'Онучин',
          firstName: 'Глеб',
          fatherName: '',
          birthday: '2004-04-15',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        Mdt6YanE0oZCSa2JsjWM: {
          gender: 'Муж',
          familyName: 'Сергеев',
          firstName: 'Илья',
          fatherName: '',
          birthday: '2005-11-28',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        N2aNI00D9xQ8aJ6BxXek: {
          gender: 'Муж',
          familyName: 'Рыболов',
          firstName: 'Денис',
          fatherName: '',
          birthday: '2004-12-16',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        NCKksZbrJoBofuCmWbtg: {
          gender: 'Муж',
          familyName: 'Голубятников',
          firstName: 'Семен',
          fatherName: '',
          birthday: '2010-02-11',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        NrYHOqyI41vCcyOona6j: {
          gender: 'Муж',
          familyName: 'Рудов',
          firstName: 'Алексей',
          fatherName: '',
          birthday: '2008-12-10',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        O671R4uJ9lpZRSBFyV8Q: {
          gender: 'Муж',
          familyName: 'Годымчук',
          firstName: 'Никита',
          fatherName: '',
          birthday: '2004-07-15',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        PC3lTijJIyO7nAu3zBVb: {
          gender: 'Муж',
          familyName: 'Суфияров',
          firstName: 'Андрей',
          fatherName: '',
          birthday: '2002-11-20',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        PH8EcZPMX1eVmym3T9k9: {
          gender: 'Муж',
          familyName: 'Матюшев',
          firstName: 'Дмитрий',
          fatherName: '',
          birthday: '2008-05-26',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        PKJQzuQuvopYkIJ8CYHt: {
          gender: 'Муж',
          familyName: 'Кандауров',
          firstName: 'Никита',
          fatherName: 'Евгеньевич',
          birthday: '2001-09-15',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        PVgZidlGTzOIKXbDp16e: {
          gender: 'Муж',
          familyName: 'Савинов',
          firstName: 'Владимир',
          fatherName: '',
          birthday: '2011-09-29',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        QfYG0ux2fndPdG2LQLR3: {
          gender: 'Муж',
          familyName: 'Сероухов',
          firstName: 'Иван',
          fatherName: 'Евгеньевич',
          birthday: '1999-10-13',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        QieoVtFAIDHUbNJ1IImt: {
          gender: 'Муж',
          familyName: 'Тофан',
          firstName: 'Евгений',
          fatherName: '',
          birthday: '2010-08-23',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        QloTpnZufewtOPiMARjQ: {
          gender: 'Муж',
          familyName: 'Апаев',
          firstName: 'Руслан',
          fatherName: 'Мурадалиевич',
          birthday: '1987-05-14',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        R8DbTROHFrJwiSt9lSsy: {
          gender: 'Муж',
          familyName: 'Федоров',
          firstName: 'Никита',
          fatherName: '',
          birthday: '2007-12-25',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        SCiB41ICOw2G85kQOj8Z: {
          gender: 'Муж',
          familyName: 'Скворцов',
          firstName: 'Никита',
          fatherName: 'Игоревич',
          birthday: '2006-05-05',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        U8cGqMoL4zi3nieCghIq: {
          gender: 'Муж',
          familyName: 'Командаков',
          firstName: 'Даниил',
          fatherName: '',
          birthday: '2005-03-29',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        UZ0GsvopVG4xWzTyCtcn: {
          gender: 'Муж',
          familyName: 'Исаев',
          firstName: 'Александр',
          fatherName: '',
          birthday: '2007-12-27',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        VtlYG3DytQQxEFH3sgJm: {
          gender: 'Жен',
          familyName: 'Михеева',
          firstName: 'Мария',
          fatherName: '',
          birthday: '2008-03-28',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        Zg00komwrcXcCBV45ULz: {
          gender: 'Муж',
          familyName: 'Гончаров',
          firstName: 'Вячеслав',
          fatherName: '',
          birthday: '2009-05-04',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        ZjIKwRqfJ7ZatGDpHKtP: {
          gender: 'Муж',
          familyName: 'Спасенко',
          firstName: 'Артем',
          fatherName: '',
          birthday: '2005-11-17',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        ZmAXpIU9hE8roSWnwz6s: {
          gender: 'Жен',
          familyName: 'Ефимова',
          firstName: 'Алина',
          fatherName: 'Юрьевна',
          birthday: '2003-07-29',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        akD9GRnQ1Z07ND9RtOzi: {
          gender: 'Муж',
          familyName: 'Мамедов',
          firstName: 'Нурай',
          fatherName: 'Чингиз оглы',
          birthday: '2004-05-22',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        b8zuGvODL7PNP3dvRCjU: {
          gender: 'Муж',
          familyName: 'Липовцев',
          firstName: 'Степан',
          fatherName: '',
          birthday: '2006-10-05',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        cj3NRmtoJBY9OAwwMZBE: {
          gender: 'Муж',
          familyName: 'Васильев',
          firstName: 'Артем',
          fatherName: '',
          birthday: '2006-05-05',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        cs2HzkqyiRMlbO9OmYIS: {
          gender: 'Муж',
          familyName: 'Апаев',
          firstName: 'Ахмед',
          fatherName: 'Джалалович',
          birthday: '2006-08-22',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        cuQPfGdAcapoRrLebjTn: {
          gender: 'Муж',
          familyName: 'Михеев',
          firstName: 'Денис',
          fatherName: '',
          birthday: '2010-08-13',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        dUNoz48ZYhxJyvPyE39c: {
          gender: 'Жен',
          familyName: 'ххх Долганова',
          firstName: 'Ольга',
          fatherName: 'Алексеевна',
          birthday: '2009-02-07',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        dXA3xOq3LfVHKEmrzqAK: {
          gender: 'Муж',
          familyName: 'Мирзазаде',
          firstName: 'Эльвин',
          fatherName: 'Ильхамович',
          birthday: '2004-08-27',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        daHDfUoWATOneaMQJFAG: {
          gender: 'Муж',
          familyName: 'Столяров',
          firstName: 'Богдан',
          fatherName: 'Андреевич',
          birthday: '2011-09-09',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        dhdMcKU92bOsKopkx5qK: {
          gender: 'Муж',
          familyName: 'Сергеев',
          firstName: 'Андрей',
          fatherName: '',
          birthday: '2009-07-17',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        dpJYRT2sV4lfby9zeje6: {
          gender: 'Жен',
          familyName: 'Лосева',
          firstName: 'Элина',
          fatherName: '',
          birthday: '2009-07-03',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        eDlHia8IIt6CVlfp4Bsu: {
          gender: 'Жен',
          familyName: 'Шишнева',
          firstName: 'Алена',
          fatherName: '',
          birthday: '2010-07-03',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        eFYqNUJqGVM7cwHXdl1C: {
          gender: 'Муж',
          familyName: 'Гусев',
          firstName: 'Дмитрий',
          fatherName: '',
          birthday: '2007-11-18',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        eUzQFYmYRGYHrXiiKAbw: {
          gender: 'Муж',
          familyName: 'Ветлуков',
          firstName: 'Владислав',
          fatherName: '',
          birthday: '2004-12-15',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        fLgtcbeE8w2i7VAJmfaT: {
          gender: 'Муж',
          familyName: 'Балиевич',
          firstName: 'Никита',
          fatherName: '',
          birthday: '2005-06-05',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        fmz3ng8VuTXUTOyUUe7Q: {
          gender: 'Муж',
          familyName: 'Браун',
          firstName: 'Алексей',
          fatherName: '',
          birthday: '2003-11-12',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        gqEU6ME2bAf9YRP1N0Zb: {
          gender: 'Муж',
          familyName: 'Щербаков',
          firstName: 'Дмитрий',
          fatherName: '',
          birthday: '2010-06-19',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        i7NuxyHcgiinXMvTueDW: {
          gender: 'Муж',
          familyName: 'Меркулов',
          firstName: 'Илья',
          fatherName: '',
          birthday: '2010-08-07',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        iSeWPPtgcatDYU1rZ2z3: {
          gender: 'Муж',
          familyName: 'Пикула',
          firstName: 'Александр',
          fatherName: '',
          birthday: '2008-12-07',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        imL3FpoZamMtIQ425y4n: {
          gender: 'Муж',
          familyName: 'Суворов',
          firstName: 'Алексей',
          fatherName: '',
          birthday: '2003-11-12',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        kTSdhZOAZCH6ywXbhy0t: {
          gender: 'Муж',
          familyName: 'Винниченко',
          firstName: 'Роман',
          fatherName: '',
          birthday: '2010-10-12',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        krVLODKSWjNYjCvGIcFS: {
          gender: 'Муж',
          familyName: 'Родыгин',
          firstName: 'Роман',
          fatherName: '',
          birthday: '2005-12-06',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        mikVwgN9fhVrSjGqzNLq: {
          gender: 'Жен',
          familyName: 'Сливкина',
          firstName: 'Виктория',
          fatherName: 'Юрьевна',
          birthday: '2010-08-03',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        o3L3F6n1kO1c0IAuvTqO: {
          gender: 'Муж',
          familyName: 'Алистратов',
          firstName: 'Владислав',
          fatherName: 'Романович',
          birthday: '2004-12-25',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        oKeMO47WwDHD4K8hqhF9: {
          gender: 'Муж',
          familyName: 'Винтер',
          firstName: 'Александр',
          fatherName: '',
          birthday: '2007-12-22',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        pXC3Tg0mzon8zr8cWW9r: {
          gender: 'Муж',
          familyName: 'ххх Рязанов',
          firstName: 'Дмитрий',
          fatherName: '',
          birthday: '2005-05-05',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        qqwTnTHb9447Sd6QwoJy: {
          gender: 'Муж',
          familyName: 'Гамов',
          firstName: 'Павел',
          fatherName: '',
          birthday: '2010-02-25',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        qrt3OxhOGgeCwHP2v7jW: {
          gender: 'Жен',
          familyName: 'Овсянникова',
          firstName: 'Александра',
          fatherName: 'Владимировна',
          birthday: '2003-03-04',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        r74ngtRbv9VzxMdNRuzm: {
          gender: 'Муж',
          familyName: 'Тэц',
          firstName: 'Даниил',
          fatherName: '',
          birthday: '2008-12-10',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        tNoa6kJbYx4MLJjEzw9j: {
          gender: 'Жен',
          familyName: 'Ларионова',
          firstName: 'Ульяна',
          fatherName: '',
          birthday: '2004-11-14',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        ti6mpDw4sbP9msMV74tt: {
          gender: 'Муж',
          familyName: 'Акберов',
          firstName: 'Артур',
          fatherName: 'Артурович',
          birthday: '2008-12-09',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        ttpWYt8HZX89waEH7s7F: {
          gender: 'Жен',
          familyName: 'Сидорова',
          firstName: 'София',
          fatherName: 'Никитична',
          birthday: '2009-06-21',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        v2kXaqfPyK2NpekWlrQE: {
          gender: 'Жен',
          familyName: 'Суфиярова',
          firstName: 'Алена',
          fatherName: '',
          birthday: '2010-02-18',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        vxvJSwWNLILL8oSYdu0w: {
          gender: 'Жен',
          familyName: 'Устьянцева',
          firstName: 'Полина',
          fatherName: '',
          birthday: '2002-11-03',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        w2nJvYvxF5bp3HHr6Qy9: {
          gender: 'Муж',
          familyName: 'Духанин',
          firstName: 'Максим',
          fatherName: '',
          birthday: '2009-05-05',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        wr6IcWUtBcqSFYQDKNYM: {
          gender: 'Муж',
          familyName: 'Решетников',
          firstName: 'Арсений',
          fatherName: '',
          birthday: '2006-05-05',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        xG97a08tYrReEDmxCGHb: {
          gender: 'Муж',
          familyName: 'Нестеров',
          firstName: 'Дмитрий',
          fatherName: '',
          birthday: '2009-08-04',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        xVruAroafjUI6txZKMzf: {
          gender: 'Муж',
          familyName: 'Рязанов',
          firstName: 'Дмитрий',
          fatherName: 'Вячеславович',
          birthday: '2005-05-28',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        xWDFnuGYoctE55FG0urn: {
          gender: 'Муж',
          familyName: 'Мартынов',
          firstName: 'Глеб',
          fatherName: '',
          birthday: '2004-03-07',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        zW76j9HFoD4TLj0NCrdk: {
          gender: 'Жен',
          familyName: 'Шипунова',
          firstName: 'Маргарита',
          fatherName: '',
          birthday: '2006-03-21',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        },
        zdj3DR8N3txWall8et82: {
          gender: 'Муж',
          familyName: 'Масленников',
          firstName: 'Роман',
          fatherName: '',
          birthday: '2008-11-07',
          created: {
            userId: '9ZEO6sUTp7hVowheANDv1YY9Eg12',
            userName: 'Руслан'
          }
        }
      }
    },
    {
      userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
      club: 'sibir',
      athletes: {
        '0fd14kHbYU7OtexKmt7u': {
          gender: 'Муж',
          familyName: 'Гомбоев',
          firstName: 'Баир',
          fatherName: 'Александрович',
          birthday: '2008-11-19',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        '1EgSUwhGMTOCrsACjoln': {
          gender: 'Муж',
          familyName: 'Плотников',
          firstName: 'Роман',
          fatherName: 'Владимирович',
          birthday: '2010-06-07',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        '1d27EOd4N2FoL3rhB8EM': {
          gender: 'Муж',
          familyName: 'Лугачев',
          firstName: 'Владислав',
          fatherName: 'Максимович',
          birthday: '2007-10-12',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        '2lJOlOk20QLdMQI9rxLq': {
          gender: 'Муж',
          familyName: 'Голубь',
          firstName: 'Александр',
          fatherName: 'Викторович',
          birthday: '2011-03-28',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        '411HQCjncfInI6tZOnha': {
          gender: 'Муж',
          familyName: 'Филонов',
          firstName: 'Константин',
          fatherName: 'Александрович',
          birthday: '2009-07-04',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        '4isjOW8V1biNivrTgob4': {
          gender: 'Жен',
          familyName: 'Сергеева',
          firstName: 'Екатерина',
          fatherName: 'Вадимовна',
          birthday: '2005-10-27',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        '8Kc20OfBXVZenp7MBNad': {
          gender: 'Муж',
          familyName: 'Миков',
          firstName: 'Егор',
          fatherName: 'Александрович',
          birthday: '2010-09-03',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        '9428PzhVPc76GtiDpoc5': {
          gender: 'Жен',
          familyName: 'Курбатова',
          firstName: 'Евгения',
          fatherName: 'Ильинична',
          birthday: '2011-07-06',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        AQKxW4ToQ8Ukbr56qTH1: {
          gender: 'Муж',
          familyName: 'Кутищев',
          firstName: 'Егор',
          fatherName: 'Николаевич',
          birthday: '2008-12-17',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        E7DP8tXKfTuVQgkkQwvx: {
          gender: 'Муж',
          familyName: 'Миков',
          firstName: 'Глеб',
          fatherName: 'Александрович',
          birthday: '2008-08-26',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        ElsssyoqkEqJQHDE0TVA: {
          gender: 'Муж',
          familyName: 'Савинов',
          firstName: 'Владимир',
          fatherName: 'Иванович',
          birthday: '2011-09-25',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        GrhlrBsb1gbIlBGPC5gB: {
          gender: 'Муж',
          familyName: 'Батожаргалов',
          firstName: 'Тамир',
          fatherName: 'Буянтоевич',
          birthday: '2005-11-20',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        I3xqRz8lsvDQSUibL18o: {
          gender: 'Муж',
          familyName: 'Ткачев',
          firstName: 'Андрей',
          fatherName: 'Дмитриевич',
          birthday: '2007-07-26',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        NvG7woWONTTTkYY5Gu85: {
          gender: 'Муж',
          familyName: 'Юсупов',
          firstName: 'Хайём',
          fatherName: 'Хусравович',
          birthday: '2008-02-21',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        QsMiWxCm8vRRGo2veuyQ: {
          gender: 'Муж',
          familyName: 'Соболев',
          firstName: 'Станислав',
          fatherName: 'Сергеевич',
          birthday: '2005-05-17',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        SlRvZVAfNo5igPfXdbvy: {
          gender: 'Муж',
          familyName: 'Бабинцев',
          firstName: 'Евгений',
          fatherName: 'Степанович',
          birthday: '2011-09-22',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        VXWUIgwAmutC3kOYEYl4: {
          gender: 'Муж',
          familyName: 'Леонов',
          firstName: 'Ярослав',
          fatherName: 'Иванович',
          birthday: '2011-09-30',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        ZP9wl9ckHhmGJsbQImbx: {
          gender: 'Муж',
          familyName: 'Скосарев',
          firstName: 'Петр',
          fatherName: 'Максимович',
          birthday: '2009-03-20',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        ZxXumSXlJtU4veMhXXe6: {
          gender: 'Жен',
          familyName: 'Чурикова',
          firstName: 'Варвара',
          fatherName: 'Владимировна',
          birthday: '2010-03-17',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        a0RD1UU5msfaCAeRnrzl: {
          gender: 'Муж',
          familyName: 'Николаев',
          firstName: 'Владислав',
          fatherName: 'Константинович',
          birthday: '2008-01-07',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        boRb3dCKIZ3YlAgLJ9K6: {
          gender: 'Муж',
          familyName: 'Левчук',
          firstName: 'Константин',
          fatherName: 'Максимович',
          birthday: '2011-06-07',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        eBelGbigkXgQysfIchum: {
          gender: 'Муж',
          familyName: 'Адианов',
          firstName: 'Андрей',
          fatherName: 'Вадимович',
          birthday: '2007-07-20',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        eDzmGHjlMKiiWTdtuU0r: {
          gender: 'Муж',
          familyName: 'Мазуркевич',
          firstName: 'Артем',
          fatherName: 'Евгеньевич',
          birthday: '2008-05-24',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        fqTv8hh24ZvgSZD6x6Ay: {
          gender: 'Муж',
          familyName: 'Полчинский',
          firstName: 'Павел',
          fatherName: 'Сергеевич',
          birthday: '2011-10-03',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        gMl0I2QTDXZvuOYzS0Gl: {
          gender: 'Муж',
          familyName: 'Кодин',
          firstName: 'Михаил',
          fatherName: 'Александрович',
          birthday: '2005-12-04',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        h4lDjOkzZRVbT4Nmesaz: {
          gender: 'Муж',
          familyName: 'Архипов',
          firstName: 'Матвей',
          fatherName: 'Максимович',
          birthday: '2008-08-06',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        hjVSjQCuMyZy3mhQmM88: {
          gender: 'Жен',
          familyName: 'Сухарева',
          firstName: 'Яна',
          fatherName: 'Евгеньевна',
          birthday: '2008-06-10',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        l3HVjmQa8CHeBJY0ril1: {
          gender: 'Муж',
          familyName: 'Антонов',
          firstName: 'Ян',
          fatherName: 'Иванович',
          birthday: '2005-11-20',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        lr8bvjvh9LDJnB7cM1cZ: {
          gender: 'Муж',
          familyName: 'Иванов',
          firstName: 'Иван',
          fatherName: 'Владимирович',
          birthday: '2010-07-07',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        mgm02QQVDX5aPPaMYHUt: {
          gender: 'Муж',
          familyName: 'Лаздан',
          firstName: 'Кирилл',
          fatherName: 'Викторович',
          birthday: '2011-08-10',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        mzPQS0pmFAtwE6LjKm3a: {
          gender: 'Муж',
          familyName: 'Величко',
          firstName: 'Артем',
          fatherName: 'Алексеевич',
          birthday: '2005-04-24',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        nC70yBfq03hhNlmZW5AM: {
          gender: 'Муж',
          familyName: 'Буренок',
          firstName: 'Егор',
          fatherName: 'Васильевич',
          birthday: '2007-10-22',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        qEfNkehk0M91m3BvKNmH: {
          gender: 'Муж',
          familyName: 'Дементьев',
          firstName: 'Дмитрий',
          fatherName: 'Александрович',
          birthday: '2009-03-18',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        rVD6TDmhJMoKr1YHyMYF: {
          gender: 'Муж',
          familyName: 'Кулябко',
          firstName: 'Максим',
          fatherName: 'Алексеевич',
          birthday: '2007-09-01',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        uJybClfCR1TPkptYfTFT: {
          gender: 'Жен',
          familyName: 'Новосельцева',
          firstName: 'Яна',
          fatherName: 'Юрьевна',
          birthday: '2008-03-12',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        zO9b70cesJGr7WFmjQ28: {
          gender: 'Муж',
          familyName: 'Степнов',
          firstName: 'Максим',
          fatherName: 'Викторович',
          birthday: '2011-01-29',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        },
        zU9oDp8MHa122ee13RE7: {
          gender: 'Жен',
          familyName: 'Кузьмич',
          firstName: 'Мария',
          fatherName: 'Дмитриевна',
          birthday: '2011-01-03',
          created: {
            userId: 'JMWh6JgDMGPcaJ35xkxMVceHQM83',
            userName: 'triadakarate'
          }
        }
      }
    },
    {
      userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
      club: 'sibir',
      athletes: {
        '0oS1oBOjL1uPSLIo65sw': {
          gender: 'Муж',
          familyName: 'Герасимов',
          firstName: 'Артур',
          fatherName: 'Николаевич',
          birthday: '2006-04-26',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        '1Q1xu3MLFtZV8g69rwrW': {
          gender: 'Муж',
          familyName: 'Носков',
          firstName: 'Максим',
          fatherName: 'Олегович',
          birthday: '2007-11-22',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        '4sw1ImH0EccZrv79pRiq': {
          gender: 'Муж',
          familyName: 'Нижников',
          firstName: 'Денис',
          fatherName: 'Андреевич',
          birthday: '2005-10-25',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        '9aYLEjhwDllXOM0qXhQg': {
          gender: 'Муж',
          familyName: 'Ощепков',
          firstName: 'Данила',
          fatherName: 'Константинович',
          birthday: '2005-03-09',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        BrIffiQidqtBkE2viPt0: {
          gender: 'Жен',
          familyName: 'Сидорова',
          firstName: 'София',
          fatherName: '',
          birthday: '2009-06-21',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        Fn4UTDtTzBA4GHsJ2q0k: {
          gender: 'Муж',
          familyName: 'Федоров',
          firstName: 'Данил',
          fatherName: '',
          birthday: '2009-05-05',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        GenZcTCJStbdKPYjniAX: {
          gender: 'Муж',
          familyName: 'Козлитин',
          firstName: 'Илья',
          fatherName: 'Александрович',
          birthday: '2009-06-19',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        JRNZUoUfsZRE9nnoCKpo: {
          gender: 'Муж',
          familyName: 'Трофимов',
          firstName: 'Никита',
          fatherName: '',
          birthday: '2009-05-05',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        JRjMBmBc4P0Oq8C19ebx: {
          gender: 'Муж',
          familyName: 'Комоедов',
          firstName: 'Семен',
          fatherName: 'Александрович',
          birthday: '2010-04-21',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        JiFwOjlXvls3BiDLEAFk: {
          gender: 'Жен',
          familyName: 'Гуцаленко',
          firstName: 'Олеся',
          fatherName: '',
          birthday: '2011-06-03',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        JvvDVbrMmOUwbwB3pux4: {
          gender: 'Муж',
          familyName: 'Бакунчев',
          firstName: 'Александр',
          fatherName: '',
          birthday: '2008-03-23',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        LTFYG949qJA0EXkXFJJi: {
          gender: 'Муж',
          familyName: 'Коростелев',
          firstName: 'Егор',
          fatherName: 'Алексеевич',
          birthday: '2007-05-18',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        MigVogKOQY66zADmshQ5: {
          gender: 'Жен',
          familyName: 'Чекаева',
          firstName: 'Ксения',
          fatherName: 'Денисовна',
          birthday: '2009-10-05',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        NLuXroP1575sJRYDB5F8: {
          gender: 'Муж',
          familyName: 'Журба',
          firstName: 'Анатолий',
          fatherName: 'Иванович',
          birthday: '2008-08-06',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        No3llPui026D773dSDKW: {
          gender: 'Жен',
          familyName: 'Суворова',
          firstName: 'Ангелина',
          fatherName: 'Евгеньевна',
          birthday: '2006-01-09',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        Nx58ZoKA4iXcMXBawtbJ: {
          gender: 'Муж',
          familyName: 'Семенов',
          firstName: 'Николай',
          fatherName: 'Денисович',
          birthday: '2009-04-14',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        PoaONzoEIvO4kGGBkBfk: {
          gender: 'Муж',
          familyName: 'Антонов',
          firstName: 'Степан',
          fatherName: 'Дмитриевич',
          birthday: '2008-09-05',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        U2kn9BGswZRHaYGyrvKp: {
          gender: 'Муж',
          familyName: 'Суворов',
          firstName: 'Андрей',
          fatherName: '',
          birthday: '2010-05-05',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        UBQS1otXeq2bVOm06tDY: {
          gender: 'Муж',
          familyName: 'Шагаев',
          firstName: 'Артем',
          fatherName: 'Антонович',
          birthday: '2010-09-01',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        V03XKmjBsYPlZMwxNtXV: {
          gender: 'Муж',
          familyName: 'Надрин',
          firstName: 'Вадим',
          fatherName: 'Сергеевич',
          birthday: '2005-07-23',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        V87XNj3KtASY8S4H9VqC: {
          gender: 'Жен',
          familyName: 'Бочкарева',
          firstName: 'Анастасия',
          fatherName: 'Юрьевна',
          birthday: '2007-06-08',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        Xlg1WUMM7rAgsnOOPmcg: {
          gender: 'Муж',
          familyName: 'Мещеряков',
          firstName: 'Роман',
          fatherName: '',
          birthday: '2009-05-05',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        Zj8T1UWVlGeouTU2rRJb: {
          gender: 'Муж',
          familyName: 'Ершов',
          firstName: 'Кирилл',
          fatherName: '',
          birthday: '2011-10-24',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        aTlNDgIWy5OCsMPfOzok: {
          gender: 'Муж',
          familyName: 'Абдувосилов',
          firstName: 'Мухаммадазиз',
          fatherName: '',
          birthday: '2006-05-05',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        atgarEr5GrHyyyA4f6lM: {
          gender: 'Муж',
          familyName: 'Негреев',
          firstName: 'Никита',
          fatherName: 'Игоревич',
          birthday: '2009-03-31',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        bdAVqCO9Wd2BOSi8TSeg: {
          gender: 'Муж',
          familyName: 'Лемешко',
          firstName: 'Виктор',
          fatherName: 'Петрович',
          birthday: '2009-07-17',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        cMA8VrR5rjKBIsrJJszV: {
          gender: 'Муж',
          familyName: 'Хербер',
          firstName: 'Данил',
          fatherName: '',
          birthday: '2007-05-05',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        cVNsozCbQ3XYgXNuJlAl: {
          gender: 'Жен',
          familyName: 'Попова',
          firstName: 'Полина',
          fatherName: 'Владимировна',
          birthday: '2005-07-07',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        eOXUTeE2Zt9Oz6WYWNWv: {
          gender: 'Муж',
          familyName: 'Воронков',
          firstName: 'Егор',
          fatherName: 'Сергеевич',
          birthday: '2005-09-13',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        fEQNZGLHT0s3VChgPW0M: {
          gender: 'Муж',
          familyName: 'Писклов',
          firstName: 'Вячеслав',
          fatherName: 'Константинович',
          birthday: '2008-02-12',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        h8smYHmJ8c85tgRF3YLi: {
          gender: 'Муж',
          familyName: 'Морозовский',
          firstName: 'Андрей',
          fatherName: '',
          birthday: '2008-05-05',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        h9BjCRVH15wBEw6PTXeU: {
          gender: 'Муж',
          familyName: 'Филиппов',
          firstName: 'Андрей',
          fatherName: 'Александрович',
          birthday: '2008-04-15',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        huhOILcPbQfhMfeBS8zf: {
          gender: 'Жен',
          familyName: 'Кульгавых',
          firstName: 'Лилия',
          fatherName: 'Максимовна',
          birthday: '2011-07-26',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        iH6gcfjAk2goG5ULv4Id: {
          gender: 'Муж',
          familyName: 'Огнев',
          firstName: 'Артем',
          fatherName: 'Константинович',
          birthday: '2010-05-04',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        kK9KQjkxXJuJCduV7KV5: {
          gender: 'Муж',
          familyName: 'Татаркин',
          firstName: 'Артем',
          fatherName: 'Максимович',
          birthday: '2008-12-29',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        lJ153PJlczMvWbJIcb4U: {
          gender: 'Муж',
          familyName: 'Кульгавых',
          firstName: 'Никита',
          fatherName: 'Максимович',
          birthday: '2007-04-19',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        m1s1lppe2TSOEH8IuAbV: {
          gender: 'Муж',
          familyName: 'Гынгазов',
          firstName: 'Дмитрий',
          fatherName: 'Алексеевич',
          birthday: '2007-03-13',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        mImp5py9Xofr3oR8TpYD: {
          gender: 'Муж',
          familyName: 'Калинин',
          firstName: 'Семен',
          fatherName: 'Владимирович',
          birthday: '2008-09-04',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        mQB4oCMYbTwPVFdX1LZT: {
          gender: 'Муж',
          familyName: 'Малолетко',
          firstName: 'Антон',
          fatherName: 'Владимирович',
          birthday: '2005-08-30',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        oZStKG7sWpajcyDQHieE: {
          gender: 'Муж',
          familyName: 'Попов',
          firstName: 'Михаил',
          fatherName: 'Владимирович',
          birthday: '2007-09-14',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        pbE0bHciy3KIOAWEaaUo: {
          gender: 'Муж',
          familyName: 'Хавруцкий',
          firstName: 'Илья',
          fatherName: '',
          birthday: '2006-09-17',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        q71OgoLpZtdOWmGBFUE1: {
          gender: 'Муж',
          familyName: 'Кирьянов',
          firstName: 'Михаил',
          fatherName: 'Витальевич',
          birthday: '2010-10-07',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        qVSS1wPcYXVTBpmelOIa: {
          gender: 'Муж',
          familyName: 'Буринок',
          firstName: 'Николай',
          fatherName: 'Андреевич',
          birthday: '2009-01-14',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        qysZfjUAcNLNCXmkIRup: {
          gender: 'Жен',
          familyName: 'Демина',
          firstName: 'Александра',
          fatherName: '',
          birthday: '2009-05-05',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        sRYHwYrM0yXc97equk8R: {
          gender: 'Муж',
          familyName: 'Стасев',
          firstName: 'Степан',
          fatherName: '',
          birthday: '2010-05-05',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        u3T14CvhdjJlcOf83Iu4: {
          gender: 'Муж',
          familyName: 'Дик',
          firstName: 'Кирилл',
          fatherName: 'Евгеньевич',
          birthday: '2006-09-17',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        u8KjSMwPwgJgKOzQuL4p: {
          gender: 'Муж',
          familyName: 'Есаулов',
          firstName: 'Александр',
          fatherName: '',
          birthday: '2010-05-05',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        uBF5Q81KfpcNAiyC3NIy: {
          gender: 'Муж',
          familyName: 'Трофимов',
          firstName: 'Никита',
          fatherName: '',
          birthday: '2009-07-26',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        vOks8sYmPGlG7xL9f8YB: {
          gender: 'Муж',
          familyName: 'Кудрявцев',
          firstName: 'Федор',
          fatherName: 'Алексеевич',
          birthday: '2007-11-15',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        vkmMw8VVMKbV83Qt995w: {
          gender: 'Муж',
          familyName: 'Волков',
          firstName: 'Антон',
          fatherName: 'Петрович',
          birthday: '2008-01-22',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        wX1B74W7mnqWVqK9nWAM: {
          gender: 'Муж',
          familyName: 'Азаров',
          firstName: 'Святозар',
          fatherName: 'Александрович',
          birthday: '2010-10-26',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        x9pDeahApoQP6alRtR3u: {
          gender: 'Муж',
          familyName: 'Перкин',
          firstName: 'Матвей',
          fatherName: 'Витальевич',
          birthday: '2009-09-28',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        y1wNwyes4X8MbZC2VJgK: {
          gender: 'Муж',
          familyName: 'Паньшин',
          firstName: 'Евгений',
          fatherName: '',
          birthday: '2009-11-12',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        },
        zLhw80SoBy03cg9EoWlX: {
          gender: 'Муж',
          familyName: 'Губин',
          firstName: 'Артур',
          fatherName: 'Владимирович',
          birthday: '2000-05-18',
          created: {
            userId: '4Xg4561WCAaCaS8ruFAPVv9V6mC3',
            userName: 'aaa'
          }
        }
      }
    },
    {
      userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
      club: 'sibir',
      athletes: {
        '2VpDwNLxLDiSjOAKXPd0': {
          gender: 'Муж',
          familyName: 'Пивнев',
          firstName: 'Роман',
          fatherName: 'Денисович',
          birthday: '2010-10-21',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        '4PhTSBo0rVrab0CvuwzN': {
          gender: 'Муж',
          familyName: 'Замараев',
          firstName: 'Илья',
          fatherName: 'Дмитриевич',
          birthday: '2009-11-03',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        '6pL2CjVNlFibaNiVE71W': {
          gender: 'Жен',
          familyName: 'Заричная',
          firstName: 'Таисия',
          fatherName: 'Александровна',
          birthday: '2009-12-30',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        BxAC21bTRVzIFLw1yrh8: {
          gender: 'Муж',
          familyName: 'Степченко',
          firstName: 'Макар',
          fatherName: '',
          birthday: '2010-11-07',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        C84EfllDvTKz8uMdkLAs: {
          gender: 'Муж',
          familyName: 'Решетников',
          firstName: 'Арсений',
          fatherName: 'Артемович',
          birthday: '2007-09-13',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        Cp0G9WThNhBxOyVez661: {
          gender: 'Муж',
          familyName: 'Сейиткулов',
          firstName: 'Ильз',
          fatherName: 'Расулович',
          birthday: '2009-11-19',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        EPGVmhgDQu9yxWTu12fE: {
          gender: 'Муж',
          familyName: 'Скороходов',
          firstName: 'Юрий',
          fatherName: 'Сергеевич',
          birthday: '2009-10-06',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        FToSIhUXowod7iKUyIpn: {
          gender: 'Муж',
          familyName: 'Серебренников',
          firstName: 'Руслан',
          fatherName: 'Павлович',
          birthday: '2008-11-15',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        FnwKmp4lElQCFiTK1bqN: {
          gender: 'Муж',
          familyName: 'Муханов',
          firstName: 'Константин',
          fatherName: 'Дмитриевич',
          birthday: '2008-03-05',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        GJhzsHnFgeEtL2Je3hIg: {
          gender: 'Муж',
          familyName: 'Каюмов',
          firstName: 'Марат',
          fatherName: 'Рамильевич',
          birthday: '2009-08-30',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        HAvJIk1fxG8oVwSN3MS1: {
          gender: 'Жен',
          familyName: 'Кирьянова',
          firstName: 'Ксенья',
          fatherName: 'Владимировна',
          birthday: '2010-07-25',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        JzsBvZDjIK6gj4fzb0dX: {
          gender: 'Муж',
          familyName: 'Елизаров',
          firstName: 'Артем',
          fatherName: '',
          birthday: '2009-05-12',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        KMFadF50aJ5NWbNC87xi: {
          gender: 'Муж',
          familyName: 'Плевков',
          firstName: 'Максим',
          fatherName: 'Сергеевич',
          birthday: '2010-09-27',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        L2ZdHbqbCXpSq0t9w5hd: {
          gender: 'Муж',
          familyName: 'Малогин',
          firstName: 'Руслан',
          fatherName: 'Александрович',
          birthday: '2004-04-20',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        LBRVmAz7eWgWSzvJnHar: {
          gender: 'Муж',
          familyName: 'Миронов',
          firstName: 'Тимофей',
          fatherName: 'Олегович',
          birthday: '2007-02-17',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        LVqhw54Zwc1szOaGueFl: {
          gender: 'Муж',
          familyName: 'Мунгалов',
          firstName: 'Андрей',
          fatherName: 'Юрьевич',
          birthday: '2010-01-05',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        MyvD6fnlNN9ROaR0KvB6: {
          gender: 'Муж',
          familyName: 'Суходольский',
          firstName: 'Александр',
          fatherName: 'Евгеньевич',
          birthday: '2008-02-23',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        NgApe7wQXAoD7XwICWWX: {
          gender: '',
          familyName: 'Шестаков',
          firstName: 'Артем',
          fatherName: '',
          birthday: '',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        NocWZ0dfyBxAOWHNYhkT: {
          gender: 'Жен',
          familyName: 'Дель',
          firstName: 'Влада',
          fatherName: 'Даниловна',
          birthday: '2010-02-03',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        QHtXE0HHtMD2QupW7i5q: {
          gender: 'Муж',
          familyName: 'Лазько',
          firstName: 'Илья',
          fatherName: 'Сергеевич',
          birthday: '2008-08-03',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        QTDlccJsPLDXxiBfMjVv: {
          gender: 'Жен',
          familyName: 'Ведерникова',
          firstName: 'Анна',
          fatherName: 'Алексеевна',
          birthday: '2010-04-16',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        RdjphvzHdALXnzg44DxS: {
          gender: 'Муж',
          familyName: 'Головин',
          firstName: 'Владислав',
          fatherName: 'Витальевич',
          birthday: '2005-06-09',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        U6ckoxKgJQa1ijZeb8Iw: {
          gender: 'Муж',
          familyName: 'Головин',
          firstName: 'Ярослав',
          fatherName: 'Витальевич',
          birthday: '2010-08-11',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        UjvLusrUiUCq0qv2nz09: {
          gender: 'Муж',
          familyName: 'Богданов',
          firstName: 'Николай',
          fatherName: '',
          birthday: '',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        WuxQDrvtXc7JkRuQpPLr: {
          gender: 'Муж',
          familyName: 'Куприн',
          firstName: 'Константин',
          fatherName: 'Дмитриевич',
          birthday: '2010-12-02',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        XeIFg7wS75csN4ahquYz: {
          gender: 'Муж',
          familyName: 'Владимиров',
          firstName: 'Алексей',
          fatherName: 'Дмитриевич',
          birthday: '2005-01-24',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        Yo4HQOzNp31FlR5zaUxS: {
          gender: 'Муж',
          familyName: 'Косолапов',
          firstName: 'Никита',
          fatherName: 'Андреевич',
          birthday: '2008-02-09',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        d71XdTxwh5FEJq6UXILL: {
          gender: 'Муж',
          familyName: 'Васильев',
          firstName: 'Иван',
          fatherName: 'Сергеевич',
          birthday: '2005-09-16',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        dIJr5sMuEsL2hEwogUXv: {
          gender: 'Муж',
          familyName: 'Жолобов',
          firstName: 'Павел',
          fatherName: 'Олегович',
          birthday: '2008-12-24',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        ddsb2emsar5P7KuajL0y: {
          gender: 'Муж',
          familyName: 'Дудин',
          firstName: 'Кирилл',
          fatherName: 'Геннадьевич',
          birthday: '2004-12-20',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        drDwEqhWgKEbrzH5ro7T: {
          gender: 'Муж',
          familyName: 'Гульбин',
          firstName: 'Вадим',
          fatherName: 'Константинович',
          birthday: '2009-06-25',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        eUSHjiqsE94S5egvE52d: {
          gender: 'Жен',
          familyName: 'Редлих',
          firstName: 'Лилия',
          fatherName: 'Эдуардовна',
          birthday: '2010-07-24',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        ezLqtOGhdWGM6oXmDUZt: {
          gender: 'Муж',
          familyName: 'Анисимов',
          firstName: 'Данил',
          fatherName: 'Витальевич',
          birthday: '2006-09-20',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        gYDbqskYd0Oc2SA3u1nr: {
          gender: 'Муж',
          familyName: 'Лапицкий',
          firstName: 'Кирилл',
          fatherName: 'Михайлович',
          birthday: '2007-04-03',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        gZuV96pIdrsrPwiI9cEW: {
          gender: 'Жен',
          familyName: 'Михня',
          firstName: 'Ева',
          fatherName: 'Вячеславовна',
          birthday: '2010-09-06',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        hS2KLvmIz3SGhjJHzPfq: {
          gender: 'Муж',
          familyName: 'Шингерей',
          firstName: 'Иван',
          fatherName: 'александрович',
          birthday: '2009-12-30',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        jKqhLRhQZZiBdasAgZZs: {
          gender: 'Жен',
          familyName: 'Первушина',
          firstName: 'Анна',
          fatherName: 'Левоновна',
          birthday: '2004-01-17',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        kctpJZu0QpIWmRPGyTbU: {
          gender: 'Муж',
          familyName: 'Косаев',
          firstName: 'Эмил',
          fatherName: 'Маджмаддин оглы',
          birthday: '2006-10-21',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        kxADfewvHhgGXKH0iusx: {
          gender: 'Муж',
          familyName: 'Косаев',
          firstName: 'Ренат',
          fatherName: 'Маджмаддин оглы',
          birthday: '2008-03-15',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        l0NaqFAzavqktmWpEk4i: {
          gender: 'Муж',
          familyName: 'Шнейдер',
          firstName: 'Богдан',
          fatherName: 'Игоревич',
          birthday: '2009-08-12',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        lGVoK87zuTG83HmMNtbg: {
          gender: 'Жен',
          familyName: 'Дашкова',
          firstName: 'Мелания',
          fatherName: 'Александровна',
          birthday: '2010-01-15',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        mrnsyBJPCTDLMfESV3jj: {
          gender: 'Жен',
          familyName: 'Аникеева',
          firstName: 'Елизавета',
          fatherName: 'Дмитриевна',
          birthday: '2004-03-31',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        p1N0JxdX86VY1pM8u7we: {
          gender: 'Муж',
          familyName: 'Гайлюс',
          firstName: 'Геннадий',
          fatherName: 'Константинович',
          birthday: '2003-01-22',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        qcTUI8rzxF4YegAXdMNt: {
          gender: 'Муж',
          familyName: 'Долганов',
          firstName: 'Максим',
          fatherName: 'Алексеевич',
          birthday: '2005-07-17',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        smzrw2sGZWTQr3UzSTFg: {
          gender: 'Жен',
          familyName: 'Долганова',
          firstName: 'Ольга',
          fatherName: 'Алексеевна',
          birthday: '2009-02-07',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        tr699Az8v5YOW2j76hWn: {
          gender: 'Жен',
          familyName: 'Большакова',
          firstName: 'Софья',
          fatherName: 'Андреевна',
          birthday: '2010-06-16',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        uKLCD6ekNCZifJgG6gLt: {
          gender: 'Муж',
          familyName: 'Кирилов',
          firstName: 'Егор',
          fatherName: 'Алексеевич',
          birthday: '2008-12-27',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        ySEhZ4V8Mm6Rxc4tTSrg: {
          gender: 'Муж',
          familyName: 'Соколов',
          firstName: 'Степан',
          fatherName: 'Иванович',
          birthday: '2009-06-06',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        },
        zP6Mh08Gdyd8CBIvOJGg: {
          gender: 'Муж',
          familyName: 'Рязанов',
          firstName: 'Дмитрий',
          fatherName: 'Вячеславович',
          birthday: '2005-05-28',
          created: {
            userId: 'HqV79gTXe2QsflX48HLXvBqCmRF2',
            userName: 'mihnya'
          }
        }
      }
    },
    {
      userId: 'd0HCXCATaNZbTkNWPnt9WLucS1I2',
      club: 'sibir',
      athletes: {
        '9CK81d3KMYONGfTqWg4I': {
          gender: 'Муж',
          familyName: 'Иванов',
          firstName: 'Иван',
          fatherName: '',
          birthday: '2009-01-01',
          created: {
            userId: 'd0HCXCATaNZbTkNWPnt9WLucS1I2',
            userName: 'aparus'
          }
        },
        '9X7jtMhV9AClDsZsMTzD': {
          gender: 'Муж',
          familyName: 'Васечкин',
          firstName: 'Василий',
          fatherName: 'Иванович',
          birthday: '2009-01-01',
          created: {
            userId: 'd0HCXCATaNZbTkNWPnt9WLucS1I2',
            userName: 'aparus'
          }
        },
        CWffH3hWyDVFbxlSyzji: {
          gender: 'Муж',
          familyName: 'Ахмедов',
          firstName: 'Ахмедхан',
          fatherName: 'Ахмедович',
          birthday: '2009-10-01',
          created: {
            userId: 'd0HCXCATaNZbTkNWPnt9WLucS1I2',
            userName: 'aparus'
          }
        },
        RiuNQaJy0hspz5FodjgV: {
          gender: 'Муж',
          familyName: 'Петров',
          firstName: 'Петр',
          fatherName: '',
          birthday: '2009-01-02',
          created: {
            userId: 'd0HCXCATaNZbTkNWPnt9WLucS1I2',
            userName: 'aparus'
          }
        },
        To8JbujaKcQbD5eF8tmI: {
          gender: 'Муж',
          familyName: 'Магомедов',
          firstName: 'Магомед',
          fatherName: '',
          birthday: '2009-01-01',
          created: {
            userId: 'd0HCXCATaNZbTkNWPnt9WLucS1I2',
            userName: 'aparus'
          }
        },
        kBaJRQ5pdKNnu9ngJS6e: {
          gender: 'Муж',
          familyName: 'Шевченко',
          firstName: 'Максим',
          fatherName: 'Рафаэльевич',
          birthday: '2009-01-02',
          created: {
            userId: 'd0HCXCATaNZbTkNWPnt9WLucS1I2',
            userName: 'aparus'
          }
        }
      }
    }
  ]

  athletes.forEach(elem => {
    const { userId, club, athletes } = elem
    db.collection('athletes')
      .doc(userId)
      .set({ ...athletes, club })
  })
}

// iterateDocs('applications')
// writeAthletesOneDocForOneTrainer()
// readAthletsIntoDocByTrainer()
// deleteCollection('trainers')
// deleteDocs('applications')
// readCategoriesIntoOneDoc()
// printCollection('applications')
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
