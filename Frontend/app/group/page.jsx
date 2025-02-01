'use client'

import React, { useState, useEffect, useContext } from 'react';
import { firestore, doc, setDoc, getDoc, updateDoc } from '@lib/firebase';
import { UserContext } from '@lib/context'; // Import UserContext to get the user data

export default function Group() {
  const [newLabel, setNewLabel] = useState('');
  const [label, setLabel] = useState('');
  const [email, setEmail] = useState('');
  const [labels, setLabels] = useState({}); // Initialize labels as an empty object
  const { user, username } = useContext(UserContext); // Get user and username from UserContext

  useEffect(() => {
    fetchLabels();
  }, [username]);

  // Fetch existing labels and emails from Firestore
  const fetchLabels = async () => {
    console.log(username)
    const labelsDocRef = doc(firestore, `groups/${username}`);
    const labelsDocSnap = await getDoc(labelsDocRef);
    if (labelsDocSnap.exists()) {
      console.log('Document data:', labelsDocSnap.data());
      setLabels(labelsDocSnap.data().labels || {});
    }else{
      console.log("dont exist")
    }
  };

// Add a new label to Firestore
const handleAddLabel = async () => {
  if (newLabel.trim() && !labels[newLabel]) {
    const labelsDocRef = doc(firestore, `groups/${username}`);
    const updatedLabels = { ...labels, [newLabel]: [] }; // New label with an empty array

    try {
      // Update state and Firestore
      setLabels(updatedLabels);
      setNewLabel(''); // Reset the input field

      // Create or update the document
      await setDoc(
        labelsDocRef,
        {
          labels: {
            [newLabel]: [] // Initialize the new label as an empty array
          }
        },
        { merge: true } // Merge ensures it updates if exists, or creates if not
      );

      console.log('Label added successfully');
    } catch (error) {
      console.error('Error adding label:', error);
      alert('Failed to add label. Please try again.');
    }
  }
};

// Add an email to a specific label in Firestore
const handleAddEmailToLabel = async () => {
  if (label && email.trim()) {
    const labelsDocRef = doc(firestore, `groups/${username}`);
    const updatedEmails = labels[label] ? [...labels[label], email] : [email]; // Add email to existing array

    // Update state and Firestore
    setLabels((prevLabels) => ({
      ...prevLabels,
      [label]: updatedEmails
    }));
    setEmail('');
    await updateDoc(labelsDocRef, {
      [`labels.${label}`]: updatedEmails // Update the specific label's email array
    });
  }
};

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-6">
      {/* Add Label Section */}
      <div className="form-control">
        <label className="label">
          <span className="label-text text-lg font-bold">Add a New Label</span>
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Enter label"
            className="input input-bordered w-full"
          />
          <button onClick={handleAddLabel} className="btn btn-primary">
            Add
          </button>
        </div>
      </div>

      {/* Add Email to Label Section */}
      <div className="form-control">
        <label className="label">
          <span className="label-text text-lg font-bold">Add Email to Label</span>
        </label>
        <div className="flex space-x-2">
          <select
            className="select select-bordered w-full"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          >
            <option disabled value="">
              Select label
            </option>
            {Object.keys(labels).map((lbl, index) => (
              <option key={index} value={lbl}>
                {lbl}
              </option>
            ))}
          </select>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="input input-bordered w-full"
          />
          <button onClick={handleAddEmailToLabel} className="btn btn-accent">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
