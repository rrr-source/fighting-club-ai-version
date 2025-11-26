import { initializeApp } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { onDocumentWritten } from 'firebase-functions/v2/firestore'

initializeApp()
const db = getFirestore()

export const syncWeightClassIndex = onDocumentWritten(
  'fighters/{fighterId}',
  async (event) => {
    const fighterId = event.params.fighterId
    const before = event.data?.before.data()
    const after = event.data?.after.data()

    // удаление
    if (!event.data?.after.exists) {
      if (before?.weightClassId) {
        await db
          .collection('weightClassFighters')
          .doc(before.weightClassId)
          .update({
            fighterIds: FieldValue.arrayRemove(fighterId)
          })
      }
      return
    }

    const oldWeightClassId = before?.weightClassId
    const newWeightClassId = after?.weightClassId

    if (oldWeightClassId && oldWeightClassId !== newWeightClassId) {
      await db
        .collection('weightClassFighters')
        .doc(oldWeightClassId)
        .update({
          fighterIds: FieldValue.arrayRemove(fighterId)
        })
    }

    if (newWeightClassId) {
      await db
        .collection('weightClassFighters')
        .doc(newWeightClassId)
        .set(
          {
            fighterIds: FieldValue.arrayUnion(fighterId)
          },
          { merge: true }
        )
    }
  }
)
