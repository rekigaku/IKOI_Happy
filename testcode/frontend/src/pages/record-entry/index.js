import { useState, useEffect } from 'react';

export default function RecordEntry() {
  const [userId, setUserId] = useState('');
  const [recordDate, setRecordDate] = useState('');
  const [actions, setActions] = useState([]);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        const response = await fetch('/api/get_action_data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ employee_id: userId })
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // 前提として、actionのデータにはidプロパティがあると想定しています
        setActions(data.map(action => ({ id: action.action_id, name: action.action_name, selected: false })));
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
      }
    };

    if (userId) fetchActions();
  }, [userId]);

  const toggleActionSelection = (actionId) => {
    setActions(prevActions =>
      prevActions.map(action =>
        action.id === actionId ? { ...action, selected: !action.selected } : action
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedActionIds = actions.filter(action => action.selected).map(action => action.id);
    const dataToSend = {
      employee_id: userId,
      record_date: recordDate,
      action_ids: selectedActionIds
    };

    try {
      const response = await fetch('/api/add_records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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
        {/* ...その他のUIコード... */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">データ入力</h2>
        {/* ユーザーIDと登録日 */}
        {/* ...その他のUIコード... */}
        <div className="mb-4">
          <label htmlFor="userId" className="block text-gray-700 text-sm font-bold mb-2">ユーザーID:</label>
          <input
            type="text"
            id="userId"
            name="userId"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
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
            onChange={(e) => setRecordDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <span className="text-gray-700 text-sm font-bold mb-2">アクション:</span>
          <div className="grid grid-cols-2 gap-4">
            {actions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => toggleActionSelection(action.id)}
                className={`w-full px-4 py-2 text-sm ${action.selected ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out`}
              >
                {action.name}
              </button>
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
