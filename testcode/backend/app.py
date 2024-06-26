# 必要なライブラリのインポート
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from db_control import mymodels, crud
from datetime import datetime


# Flaskアプリのインスタンスを生成。CORSによって、異なるドメインからのappへのリクエストを許可。
app = Flask(__name__)
CORS(app)

# Flaskトップページの表示
@app.route('/')
def index():
    return "WELCOME to IKOI app"

# employee_idとrecord_dateの期間を指定することで、特定の人、期間のrecordsデータを返すAPI
# 山脇変更　get_records ⇒　get_filterd_recordsに変更
@app.route('/get_filtered_records', methods=['POST'])
def get_records():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    values = request.get_json()

    try:
        employee_id = values['employee_id']  # 文字列のまま使用
        from_date = datetime.strptime(values['from_date'], '%Y-%m-%d')
        to_date = datetime.strptime(values['to_date'], '%Y-%m-%d')
    except KeyError as e:
        return jsonify({'error': f'Missing data for key: {e}'}), 400
    except ValueError as e:
        return jsonify({'error': f'Invalid date format or data type: {e}'}), 400

    result = crud.get_filtered_records(employee_id, from_date, to_date)
    if result:
        return jsonify(result), 200
    else:
        return jsonify({'error': 'No records found for the provided employee ID and date range'}), 404

# employee_idを指定することで、特定の人に表示すべきactionsデータを返すAPI
#山脇変更　get_action_date ⇒　
@app.route('/get_filtered_actions', methods=['POST'])
def get_action_data():
    if not request.is_json:
        return jsonify({"error": "Request body must be JSON"}), 400

    value = request.get_json()
    employee_id = value.get('employee_id')

    if employee_id is None:
        return jsonify({"error": "Missing employee_id"}), 400

    # この部分を修正: employee_idを整数に変換するのではなく、文字列のまま使用
    # try:
    #     employee_id = int(employee_id)  # 整数への変換を試みる
    # except ValueError:
    #     return jsonify({"error": "employee_id must be an integer"}), 400

    try:
        result = crud.get_filtered_actions(employee_id)
        if not result:
            return jsonify({"error": "No actions found"}), 404
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# employee_idとrecord_dateとaction_idを渡すことで、recordsテーブルにデータを追加するAPI
@app.route('/add_new_record', methods=['POST'])
def add_records():
    # frontendからJSON形式で以下の情報を受け取る。
    data = request.get_json()
    employee_id = data['employee_id']
    record_date = datetime.strptime(data["record_date"], "%Y-%m-%d").date()  # 日付のデータはstr型なので、datetime型に変換する
    for action_id in data['action_ids']:  # frontendからは複数のaction_idが送られてくるが、1つずつrecordsテーブルに追加する
        values = {
            'employee_id': employee_id,
            'record_date': record_date,
            'action_id': action_id,
        }
        # 登録関数の呼び出し(crud.pyに記載の関数add_new_recordを、mymodels.pyに記載のRecordsテーブルに対して実行する。必要な引数も渡す。)
        crud.add_new_record(mymodels.Records, values)
    return jsonify({"message":"All records inserted"}), 200

#ログイン画面接続用のAPI　POSTで設定　///山脇追加分
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400
    
    employee = crud.validate_employee_login(email, password)
    if employee:
        # パスワードフィールドは返さない
        return jsonify({"employee_id": employee.employee_id, "employee_name": employee.employee_name, "email": employee.email}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401



# frontend側のfetchtest用のAPI。jsonplaceholderというサービスを利用。
@app.route("/fetchtest")
def fetchtest():
    response = requests.get('https://jsonplaceholder.typicode.com/users')
    return response.json(), 200


if __name__ == '__main__':
    app.run(debug=True)