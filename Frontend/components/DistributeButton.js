import React, { useState, useEffect, useContext } from 'react';
import { firestore, doc, getDoc, collection, addDoc } from '@lib/firebase';
import { UserContext } from '@lib/context';

const DistributeButton = ({ docId, formData, result }) => {
  const [labels, setLabels] = useState({});
  const [selectedLabel, setSelectedLabel] = useState('');
  const { user,username } = useContext(UserContext);

  useEffect(() => {
    if (username) {
      fetchLabels();
    }
  }, [username]);

  const fetchLabels = async () => {
    try {
      const labelsDocRef = doc(firestore, `groups/${username}`);
      const labelsDocSnap = await getDoc(labelsDocRef);
      if (labelsDocSnap.exists()) {
        setLabels(labelsDocSnap.data().labels || {});
      } else {
        console.log('No document found.');
      }
    } catch (error) {
      console.error('Error fetching labels:', error);
    }
  };

  const handleDistribute = async () => {
    console.log(docId, formData, result)
    if (!selectedLabel) {
      alert('Please select a label to distribute.');
      return;
    }
  
    try {
      // Step 1: Save data to Firebase
      const distributeCollectionRef = collection(firestore, `history/${username}/exams/`);

      // Use addDoc to let Firestore generate a unique document ID
      const docRef = await addDoc(distributeCollectionRef, {
        formData,
        result,
        label: selectedLabel,
        timestamp: new Date(), // Optionally include a timestamp
      });
  
      console.log('Document written with ID:', docRef.id);

      const payload = {
        username,
        docId: docRef.id,
      };

      console.log(payload)
      
      // Step 2: Make a POST request to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exam-distributor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        alert('Content distributed successfully!');
      } else {
        const errorData = await response.json();
        console.error('Backend Error:', errorData);
        alert('Failed to notify the backend about distribution.');
      }

    } catch (error) {
      console.error('Error during distribution:', error);
      alert('An error occurred during distribution. Please try again.');
    }
  };
  
  return (
    <div className="flex items-center space-x-4 border border-gray-300 rounded-lg p-4">
      <select
        className="select select-bordered w-full max-w-xs"
        value={selectedLabel}
        onChange={(e) => setSelectedLabel(e.target.value)}
      >
        <option value="" disabled>
        Label
        </option>
        {Object.keys(labels).map((labelKey) => (
          <option key={labelKey} value={labelKey}>
            {labelKey}
          </option>
        ))}
      </select>
      <button className="btn btn-primary flex items-center space-x-2" onClick={handleDistribute}>
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 12H8m4-4v8m5-11h-2a2 2 0 00-2-2H9a2 2 0 00-2 2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2z"
          />
        </svg>
        <span>Distribute</span>
      </button>
    </div>
  );
   
};

export default DistributeButton;