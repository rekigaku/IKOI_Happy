import { useState } from 'react';

export default function RecordEntry() {
  const [userId, setUserId] = useState('');
  const [recordDate, setRecordDate] = useState('');
  const [actions, setActions] = useState({
    action1: false,
    action2: false,
    action3: false,
    action4: false,
    action5: false
  });

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === 'checkbox') {
      setActions({ ...actions, [name]: checked });
    } else {
      if (name === 'userId') setUserId(value);
      if (name === 'recordDate') setRecordDate(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedActionIds = Object.entries(actions)
      .filter(([_, value]) => value)
      .map(([key]) => parseInt(key.replace('action', ''), 10));

    const dataToSend = {
      employee_id: userId,
      record_date: recordDate,
      action_ids: selectedActionIds
    };

    try {
      const response = await fetch('/api/add_records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      if (!response.ok) {
        throw new Error(await response.json().then(data => data.message || 'Something went wrong'));
      }
      console.log('Data sent successfully');
    } catch (error) {
      console.error('Failed to submit data:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">データ入力</h2>
        <div className="mb-4">
          <label htmlFor="userId" className="block text-gray-700 text-sm font-bold mb-2">ユーザーID:</label>
          <input
            type="text"
            id="userId"
            name="userId"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={userId}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="recordDate" className="block text-gray-700 text-sm font-bold mb-2">登録日:</label>
          <input
            type="date"
            id="recordDate"
            name="recordDate"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={recordDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <span className="text-gray-700 text-sm font-bold mb-2">アクション:</span>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(actions).map((action, index) => (
              <label key={action} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={action}
                  className="form-checkbox h-5 w-5"
                  checked={actions[action]}
                  onChange={handleInputChange}
                />
                <span className="text-gray-700 text-sm">質問{index + 1}</span>
              </label>
            ))}
          </div>
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          登録する
        </button>
      </form>
    </div>
  );
}
