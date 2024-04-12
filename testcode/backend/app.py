from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


stores = [
    {
        "name": "Store1",
        "items": [
            {
                "name": "handcream",
                "price": 2400
            }
        ]
    }
]

employee = [
    {
        "position": "manager",
        "detail": [
            {
                "name": "大西美穂子",
                "email": "mihoko@mail",
                "password": "tech0"
            }
        ]
    }
]

employee2 = [
    {
        
        "name": "大西美穂子",
        "email": "mihoko@mail",
        "password": "tech0"
          
    }
]

data = [
    {
        "employee_code": "1",
        "question": [
            {
                "input_date": "2024/4/1",
                "q01": 1,
                "q02": 0,
                "q03": 1,
                "q04": 0,
                "q05": 1,
            }
        ]
    }
]


@app.route("/store")
def get_stores():
    return {"stores": stores}

@app.route("/employee")
def get_employee():
    return {"employee": employee}

@app.route("/employee2")
def get_employee2():
    return {"employee2": employee2}

@app.route("/data")
def get_data():
    return {"data": data}

if __name__ == "__main__":
    app.run(debug=True)