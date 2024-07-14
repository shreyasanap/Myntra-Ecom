import time
from werkzeug.datastructures import ImmutableMultiDict
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# API_KEY = "hb-CRAZRIWryjnjkQke8KCwYQzxHkl9tQor"
API_KEY = "hb-Gr4QbId3d73Jz5FtYknGGGYhZ6qLz6ls"
SERVICE_URL = "https://heybeauty.ai/api"


@app.post("/try-on")
def try_on_via_heybeauty():
    print("Received POST request to /try-on") 
    form = ImmutableMultiDict([*request.form.items(), *request.files.items()])

    # Step 1: Create Task
    response = requests.post(
        f"{SERVICE_URL}/create-task",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}",
        },
        json={
            "user_img_name": form.get("userImage").filename,
            "cloth_img_name": form.get("clothImage").filename,
            "category": form.get("category"),
            "caption": form.get("caption"),
        },
    )
    json = response.json()

    if json["code"] != 0:
        return {
            "errorCode": json["code"],
            "message": json.get("message", "Something went wrong"),
        }, 500

    task_uuid, user_img_url, cloth_img_url = [
        json["data"]["uuid"],
        json["data"]["user_img_url"],
        json["data"]["cloth_img_url"],
    ]

    # Step 2: Upload Images
    response = requests.put(
        user_img_url,
        headers={"Content-Type": form.get("userImage").mimetype},
        data=form.get("userImage").read(),
    )
    if response.status_code != 200:
        return {
            "errorCode": -1,
            "message": "Upstream user image upload step failed",
        }, 500

    response = requests.put(
        cloth_img_url,
        headers={"Content-Type": form.get("clothImage").mimetype},
        data=form.get("clothImage").read(),
    )
    if response.status_code != 200:
        return {
            "errorCode": -1,
            "message": "Upstream cloth image upload step failed",
        }, 500

    # Step 3: Submit Try-On Task
    response = requests.post(
        f"{SERVICE_URL}/submit-task",
        headers={"Authorization": f"Bearer {API_KEY}"},
        json={"task_uuid": task_uuid},
    )
    json = response.json()
    if json["code"] != 0:
        return {
            "errorCode": json["code"],
            "message": json.get("message", "Upstream Try-On task submit failed"),
        }, 500

    # Step 4: Query Try-On Result
    while True:
        response = requests.post(
            f"{SERVICE_URL}/get-task-info",
            headers={"Authorization": f"Bearer {API_KEY}"},
            json={"task_uuid": task_uuid},
        )
        json = response.json()
        if json["code"] != 0:
            return {
                "errorCode": json["code"],
                "message": json.get("message", "Upstream Try-On result query failed"),
            }, 500

        if json["data"]["status"] == "successed":
            break
        elif json["data"]["status"] == "failed":
            return {
                "errorCode": -1,
                "message": json["data"].get(
                    "err_msg", "Somethign went wrong with the try-on task"
                ),
            }, 500
        else:
            # wait for 4 seconds, before repeating
            time.sleep(4)
            continue

    return {
        "status": json["data"]["status"],
        "result": json["data"]["tryon_img_url"],
    }, 200


# @app.route("/create-task", methods=["POST"])
# def create_task():
#     data = response.json
#     print(f"{data=}")
#     headers = {
#         "Content-Type": "application/json",
#         "Authorization": f"Bearer {API_KEY}",
#     }
#     response = requests.post(
#         "https://heybeauty.ai/api/create-task", headers=headers, json=data
#     )
#     return jsonify(response.json())


# @app.route("/upload-image", methods=["PUT"])
# def upload_image():
#     url = request.args.get("url")
#     file = request.files["file"]
#     headers = {"Content-Type": "image/jpeg"}
#     response = requests.put(url, headers=headers, data=file)
#     return response.text


# @app.route("/submit-task", methods=["POST"])
# def submit_task():
#     data = request.json
#     headers = {
#         "Content-Type": "application/json",
#         "Authorization": f"Bearer hb-CRAZRIWryjnjkQke8KCwYQzxHkl9tQor",
#     }
#     response = requests.post(
#         "https://heybeauty.ai/api/submit-task", headers=headers, json=data
#     )
#     return jsonify(response.json())


# @app.route("/get-task-info", methods=["POST"])
# def get_task_info():
#     data = request.json
#     headers = {
#         "Content-Type": "application/json",
#         "Authorization": f"Bearer hb-CRAZRIWryjnjkQke8KCwYQzxHkl9tQor",
#     }
#     response = requests.post(
#         "https://heybeauty.ai/api/get-task-info", headers=headers, json=data
#     )
#     return jsonify(response.json())


if __name__ == "__main__":
    app.run(debug=True)
