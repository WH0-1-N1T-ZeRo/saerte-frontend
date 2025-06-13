# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
import time
import jwt
import os
import random

app = Flask(__name__)
# Aktifkan CORS untuk semua domain. Di produksi, atur ke domain frontend Anda.
CORS(app)

# --- Konfigurasi ---
# JWT Secret Key - Ganti dengan kunci yang kuat di produksi!
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'kunci_rahasia_sangat_kuat_jangan_pakai_ini_di_produksi')

# --- Data Dummy (Simulasi Database) ---
DUMMY_USERS = {} # {phone_number: {otp: "123456", expires_at: timestamp}}
DUMMY_IURAN = [
    {
        "id": "f8d7b3e2-c1a9-4d56-8e7f-0b1c2d3e4f5a", # PK, STRING (UUID)
        "akun_administrasi_rt_id": 101,
        "status": "Belum Lunas", # 'Lunas', 'Belum Lunas', 'Sebagian'
        "referensi": "IUR-202506-001",
        "tanggal": None, # Tanggal pembayaran, None jika belum lunas
        "user_nik": "1234567890123456", # Dummy NIK user yang memiliki iuran ini
        "kk_id": 1,
        "jenis_iuran": "Bulanan",
        "periode_iuran": "Juni 2025",
        "nominal": 50000.00,
        "nominal_dibayar": None,
        "keterangan": "Iuran bulanan reguler",
        "bukti_dokumen_id": None,
        "created_at": "2025-05-20T10:00:00Z",
        "updated_at": "2025-05-20T10:00:00Z"
    },
    {
        "id": "e7c6b5d4-a3f2-1c0b-9d8e-7f6a5b4c3d2e",
        "akun_administrasi_rt_id": 101,
        "status": "Lunas",
        "referensi": "IUR-202505-001",
        "tanggal": "2025-05-03",
        "user_nik": "1234567890123456",
        "kk_id": 1,
        "jenis_iuran": "Bulanan",
        "periode_iuran": "Mei 2025",
        "nominal": 50000.00,
        "nominal_dibayar": 50000.00,
        "keterangan": "Iuran bulanan reguler",
        "bukti_dokumen_id": 1,
        "created_at": "2025-04-25T09:00:00Z",
        "updated_at": "2025-05-03T11:00:00Z"
    },
    {
        "id": "d1a2b3c4-e5f6-7g8h-9i0j-1k2l3m4n5o6p",
        "akun_administrasi_rt_id": 101,
        "status": "Lunas",
        "referensi": "IUR-202504-001",
        "tanggal": "2025-04-01",
        "user_nik": "1234567890123456",
        "kk_id": 1,
        "jenis_iuran": "Bulanan",
        "periode_iuran": "April 2025",
        "nominal": 50000.00,
        "nominal_dibayar": 50000.00,
        "keterangan": "Iuran bulanan reguler",
        "bukti_dokumen_id": 2,
        "created_at": "2025-03-28T08:00:00Z",
        "updated_at": "2025-04-01T10:00:00Z"
    },
    {
        "id": "c9b8a7f6-e5d4-3c2b-1a09-8b7c6d5e4f3g",
        "akun_administrasi_rt_id": 101,
        "status": "Lunas",
        "referensi": "IUR-202503-001",
        "tanggal": "2025-03-05",
        "user_nik": "1234567890123456",
        "kk_id": 1,
        "jenis_iuran": "Bulanan",
        "periode_iuran": "Maret 2025",
        "nominal": 50000.00,
        "nominal_dibayar": 50000.00,
        "keterangan": "Iuran bulanan reguler",
        "bukti_dokumen_id": 3,
        "created_at": "2025-02-20T07:00:00Z",
        "updated_at": "2025-03-05T09:00:00Z"
    },
]
DUMMY_SURAT_PERMOHONAN = [
    {"id": str(uuid.uuid4()), "userId": "dummy_user_id_123", "jenisSurat": "Surat Keterangan Usaha", "deskripsi": "Untuk keperluan bank", "status": "Diajukan", "tanggalPengajuan": "2025-06-11", "tanggalPenyelesaian": None},
    {"id": str(uuid.uuid4()), "userId": "dummy_user_id_123", "jenisSurat": "Surat Izin Keramaian", "deskripsi": "Acara 17 Agustus", "status": "Diproses", "tanggalPengajuan": "2025-06-05", "tanggalPenyelesaian": None},
]

# --- Middleware Otentikasi Sederhana ---
def authenticate_token():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"message": "Authorization token is missing!"}), 401
    
    parts = auth_header.split()
    if parts[0].lower() != 'bearer' or len(parts) != 2:
        return jsonify({"message": "Token format is 'Bearer <token>'!"}), 401
    
    token = parts[1]
    
    try:
        # Verifikasi token JWT
        # Di sini, kita hanya mengecek apakah token bisa didecode.
        # Untuk dummy, kita asumsikan jika didecode tanpa error, berarti valid.
        decoded_token = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=["HS256"])
        request.user = decoded_token # Simpan user data dari token ke request
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired!"}), 403
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token!"}), 403
    return None # Return None jika autentikasi berhasil

# --- Auth Endpoints ---

@app.route('/api/auth/send-otp', methods=['POST'])
def send_otp():
    data = request.json
    phone_number = data.get('phoneNumber')

    if not phone_number:
        return jsonify({"message": "Nomor HP wajib diisi."}), 400

    # Simulasi generate OTP 6 digit
    otp = str(random.randint(100000, 999999)) # Untuk testing, kita pakai OTP random
    expires_at = time.time() + 300 # OTP berlaku 5 menit (300 detik)

    DUMMY_USERS[phone_number] = {"otp": otp, "expires_at": expires_at}
    print(f"Simulasi: Mengirim OTP '{otp}' ke {phone_number}. Akan kadaluarsa dalam 5 menit.")

    return jsonify({"message": "OTP berhasil dikirim."}), 200

@app.route('/api/auth/verify-otp', methods=['POST'])
def verify_otp():
    data = request.json
    phone_number = data.get('phoneNumber')
    otp_code = data.get('otp')

    if not phone_number or not otp_code:
        return jsonify({"message": "Nomor HP dan OTP wajib diisi."}), 400

    user_data = DUMMY_USERS.get(phone_number)

    if not user_data:
        return jsonify({"message": "Nomor HP tidak terdaftar atau OTP belum dikirim."}), 404

    if user_data["otp"] != otp_code:
        return jsonify({"message": "Kode OTP salah."}), 401
    
    if time.time() > user_data["expires_at"]:
        return jsonify({"message": "Kode OTP sudah kadaluarsa."}), 401

    # OTP valid, hapus dari dummy
    del DUMMY_USERS[phone_number]

    # Generate JWT Token dummy
    # Di aplikasi nyata, Anda akan mengambil user_id dari database
    user_id = "dummy_user_id_123" # ID user dummy
    token_payload = {
        'user_id': user_id,
        'phone_number': phone_number,
        'exp': time.time() + 3600 # Token berlaku 1 jam (3600 detik)
    }
    token = jwt.encode(token_payload, app.config['JWT_SECRET_KEY'], algorithm="HS256")

    return jsonify({"message": "Login berhasil.", "token": token}), 200

# --- CRUD Endpoints ---

# Helper untuk apply autentikasi ke route
def protected_route(func):
    def wrapper(*args, **kwargs):
        error_response = authenticate_token()
        if error_response:
            return error_response
        return func(*args, **kwargs)
    wrapper.__name__ = func.__name__ # Penting untuk Flask
    return wrapper

# --- Iuran CRUD Endpoints ---

@app.route('/api/iuran', methods=['GET'])
@protected_route
def get_all_iuran():
    """
    Mengambil semua data iuran.
    Dalam aplikasi nyata, ini akan memfilter berdasarkan request.user.user_id.
    """
    # Filter iuran berdasarkan user_nik dari user yang terotentikasi
    user_iuran = [item for item in DUMMY_IURAN if item["user_nik"] == request.user['user_id']]
    return jsonify(user_iuran), 200

@app.route('/api/iuran/<string:iuran_id>', methods=['GET'])
@protected_route
def get_iuran_by_id(iuran_id):
    """
    Mengambil data iuran berdasarkan ID.
    Memastikan user yang mengambil data adalah pemilik iuran tersebut.
    """
    iuran = next((item for item in DUMMY_IURAN if item["id"] == iuran_id and item["user_nik"] == request.user['user_id']), None)
    if iuran:
        return jsonify(iuran), 200
    return jsonify({"message": "Iuran tidak ditemukan atau Anda tidak memiliki akses."}), 404

@app.route('/api/iuran', methods=['POST'])
@protected_route
def create_iuran():
    """
    Membuat entri iuran baru.
    Menerima data dari frontend dan memetakannya ke skema database.
    """
    data = request.json
    
    # Mapping field dari request (yang ramah Vue.js) ke skema database
    # 'bulan' -> 'periode_iuran'
    # 'jumlah' -> 'nominal'
    # 'tanggalPembayaran' -> 'tanggal'
    # 'statusPembayaran' -> 'status'

    required_fields_vue_friendly = ["bulan", "jumlah", "statusPembayaran"]
    if not all(key in data for key in required_fields_vue_friendly):
        return jsonify({"message": "Data iuran tidak lengkap. Membutuhkan 'bulan', 'jumlah', dan 'statusPembayaran'."}), 400
    
    current_time = datetime.now().isoformat(timespec='seconds') + 'Z' # Format ISO 8601

    new_iuran = {
        "id": str(uuid.uuid4()), # Generated UUID for new entry
        "akun_administrasi_rt_id": data.get("akun_administrasi_rt_id", 101), # Default value
        "status": data["statusPembayaran"],
        "referensi": f"IUR-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8]}", # Generate unique reference
        "tanggal": data.get("tanggalPembayaran"), # Tanggal pembayaran (nullable)
        "user_nik": request.user['user_id'], # Mengambil NIK user dari token yang terautentikasi
        "kk_id": data.get("kk_id", 1), # Default value
        "jenis_iuran": data.get("jenis_iuran", "Bulanan"), # Default to 'Bulanan'
        "periode_iuran": data["bulan"],
        "nominal": float(data["jumlah"]),
        "nominal_dibayar": float(data["jumlah"]) if data["statusPembayaran"] == "Lunas" else (float(data.get("nominal_dibayar")) if "nominal_dibayar" in data else None),
        "keterangan": data.get("keterangan", "Iuran baru ditambahkan"),
        "bukti_dokumen_id": data.get("bukti_dokumen_id"),
        "created_at": current_time,
        "updated_at": current_time
    }
    DUMMY_IURAN.append(new_iuran)
    return jsonify({"message": "Iuran berhasil ditambahkan.", "iuran": new_iuran}), 201

@app.route('/api/iuran/<string:iuran_id>', methods=['PUT'])
@protected_route
def update_iuran(iuran_id):
    """
    Memperbarui entri iuran yang sudah ada.
    Memastikan user yang memperbarui adalah pemilik iuran tersebut.
    """
    data = request.json
    for i, item in enumerate(DUMMY_IURAN):
        # Periksa apakah ID iuran cocok DAN user_nik cocok (user adalah pemilik data)
        if item["id"] == iuran_id and item["user_nik"] == request.user['user_id']: 
            # Perbarui field-field yang ada di request, memetakan ke skema database
            if "bulan" in data: item["periode_iuran"] = data["bulan"]
            if "jumlah" in data: item["nominal"] = float(data["jumlah"])
            if "tanggalPembayaran" in data: item["tanggal"] = data["tanggalPembayaran"]
            if "statusPembayaran" in data: 
                item["status"] = data["statusPembayaran"]
                # Sesuaikan nominal_dibayar berdasarkan status pembayaran
                if item["status"] == "Lunas" and "nominal" in item:
                    item["nominal_dibayar"] = item["nominal"]
                elif item["status"] == "Belum Lunas":
                    item["nominal_dibayar"] = None
                elif item["status"] == "Sebagian" and "nominal_dibayar" in data:
                     item["nominal_dibayar"] = float(data["nominal_dibayar"])

            # Perbarui field skema lainnya jika disediakan di data request
            if "akun_administrasi_rt_id" in data: item["akun_administrasi_rt_id"] = data["akun_administrasi_rt_id"]
            if "referensi" in data: item["referensi"] = data["referensi"]
            if "user_nik" in data: item["user_nik"] = data["user_nik"] # Hati-hati mengubah ini
            if "kk_id" in data: item["kk_id"] = data["kk_id"]
            if "jenis_iuran" in data: item["jenis_iuran"] = data["jenis_iuran"]
            if "keterangan" in data: item["keterangan"] = data["keterangan"]
            if "bukti_dokumen_id" in data: item["bukti_dokumen_id"] = data["bukti_dokumen_id"]

            item["updated_at"] = datetime.now().isoformat(timespec='seconds') + 'Z' # Perbarui timestamp
            return jsonify({"message": "Iuran berhasil diperbarui.", "iuran": DUMMY_IURAN[i]}), 200
    return jsonify({"message": "Iuran tidak ditemukan atau Anda tidak memiliki akses."}), 404

@app.route('/api/iuran/<string:iuran_id>', methods=['DELETE'])
@protected_route
def delete_iuran(iuran_id):
    """
    Menghapus entri iuran.
    Memastikan user yang menghapus adalah pemilik iuran tersebut.
    """
    global DUMMY_IURAN # Diperlukan 'global' untuk memodifikasi list di scope ini
    initial_len = len(DUMMY_IURAN)
    # Hapus hanya jika ID cocok DAN user_nik cocok
    DUMMY_IURAN = [item for item in DUMMY_IURAN if not (item["id"] == iuran_id and item["user_nik"] == request.user['user_id'])]
    if len(DUMMY_IURAN) < initial_len:
        return jsonify({"message": "Iuran berhasil dihapus."}), 200
    return jsonify({"message": "Iuran tidak ditemukan atau Anda tidak memiliki akses."}), 404

# Surat Permohonan CRUD (Strukturnya Mirip Iuran)
@app.route('/api/surat-permohonan', methods=['GET'])
@protected_route
def get_all_surat_permohonan():
    return jsonify(DUMMY_SURAT_PERMOHONAN), 200

@app.route('/api/surat-permohonan/<string:surat_id>', methods=['GET'])
@protected_route
def get_surat_permohonan_by_id(surat_id):
    surat = next((item for item in DUMMY_SURAT_PERMOHONAN if item["id"] == surat_id), None)
    if surat:
        return jsonify(surat), 200
    return jsonify({"message": "Surat permohonan tidak ditemukan."}), 404

@app.route('/api/surat-permohonan', methods=['POST'])
@protected_route
def create_surat_permohonan():
    data = request.json
    if not all(key in data for key in ["jenisSurat", "deskripsi", "status"]):
        return jsonify({"message": "Data surat permohonan tidak lengkap."}), 400
    
    new_surat = {
        "id": str(uuid.uuid4()),
        "userId": request.user['user_id'],
        "jenisSurat": data["jenisSurat"],
        "deskripsi": data["deskripsi"],
        "status": data["status"],
        "tanggalPengajuan": data.get("tanggalPengajuan", time.strftime("%Y-%m-%d")), # Default tanggal hari ini
        "tanggalPenyelesaian": data.get("tanggalPenyelesaian")
    }
    DUMMY_SURAT_PERMOHONAN.append(new_surat)
    return jsonify({"message": "Surat permohonan berhasil ditambahkan.", "surat": new_surat}), 201

@app.route('/api/surat-permohonan/<string:surat_id>', methods=['PUT'])
@protected_route
def update_surat_permohonan(surat_id):
    data = request.json
    for i, item in enumerate(DUMMY_SURAT_PERMOHONAN):
        if item["id"] == surat_id and item["userId"] == request.user['user_id']:
            DUMMY_SURAT_PERMOHONAN[i].update(data)
            return jsonify({"message": "Surat permohonan berhasil diperbarui.", "surat": DUMMY_SURAT_PERMOHONAN[i]}), 200
    return jsonify({"message": "Surat permohonan tidak ditemukan atau Anda tidak memiliki akses."}), 404

@app.route('/api/surat-permohonan/<string:surat_id>', methods=['DELETE'])
@protected_route
def delete_surat_permohonan(surat_id):
    global DUMMY_SURAT_PERMOHONAN
    initial_len = len(DUMMY_SURAT_PERMOHONAN)
    DUMMY_SURAT_PERMOHONAN = [item for item in DUMMY_SURAT_PERMOHONAN if not (item["id"] == surat_id and item["userId"] == request.user['user_id'])]
    if len(DUMMY_SURAT_PERMOHONAN) < initial_len:
        return jsonify({"message": "Surat permohonan berhasil dihapus."}), 200
    return jsonify({"message": "Surat permohonan tidak ditemukan atau Anda tidak memiliki akses."}), 404


if __name__ == '__main__':
    # Jalankan aplikasi Flask di port 5000 (default)
    # Anda bisa ubah port jika perlu, misal: app.run(debug=True, port=8000)
    app.run(debug=True)