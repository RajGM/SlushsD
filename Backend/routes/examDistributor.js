const express = require('express');
const router = express.Router();

const { db } = require('../lib/firebase');

router.post('/', async (req, res) => {
    try {
        const { username, docId } = req.body;

        console.log(username, docId, "EXAM DISTRIBUTION");

        const docRef = db.collection('history').doc(username).collection('exams').doc(docId);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const data = docSnap.data();
            const { result, label } = data;

            const docRef2 = db.collection('groups').doc(username);
            const docSnap2 = await docRef2.get();

            console.log(data)
            console.log(docSnap2.data().labels[data.label]);
            const labelsArray = docSnap2.data().labels[data.label];

            console.log(labelsArray);

              // Prepare the result object without answers and explanations
        const filteredResult = {
            ...result,
            Questions: result.Questions.map((question) => {
                const { answer, explanation, ...rest } = question;
                return rest; // Exclude `answer` and `explanation`
            }),
        };

        console.log(filteredResult)
      
        // Create a Firestore batch
        const batch = db.batch();

        // Add writes for each label
        labelsArray.forEach((label) => {
            const labelDocRef = db.collection('exams').doc(label).collection('exam').doc(docId);
            batch.set(
                labelDocRef,
                {
                    docId,
                    createdBy: username,
                    result: filteredResult,
                },
                { merge: true } // Merge to avoid overwriting the entire document
            );
        });

        // Commit the batch
        await batch.commit();




            return res.status(200).json({ success: true, data });
        } else {
            console.error('Document does not exist.');
            return res.status(404).json({ error: 'Document not found' });
        }

    } catch (error) {
        console.error('Error in POST handler:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
