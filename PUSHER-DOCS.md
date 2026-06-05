# Pusher Integration Documentation

Aplikasi backend kita menggunakan Pusher untuk menyiarkan perubahan data secara *real-time* ke sisi *client* (frontend). Berikut adalah daftar **Channel** dan **Event** yang saat ini aktif digunakan.

> [!TIP]
> Di sisi frontend (misal React), Anda dapat me-listen event-event ini untuk men-*trigger* refetch data menggunakan React Query (`queryClient.invalidateQueries()`) atau sekadar memperbarui *state* yang ada.

---

## Standar Payload (CRUD)

Untuk sebagian besar entitas (kecuali Ranting), event yang dikirimkan memiliki struktur payload yang standar berdasarkan aksi yang dilakukan:

**1. Saat Create (Data Baru Ditambahkan)**
```json
{
  "action": "create",
  "data": { /* ... objek data secara lengkap ... */ }
}
```

**2. Saat Update (Data Diubah)**
```json
{
  "action": "update",
  "data": { /* ... objek data yang baru saja diupdate secara lengkap ... */ }
}
```

**3. Saat Delete (Data Dihapus)**
```json
{
  "action": "delete",
  "id": "6a21...id_data_yang_dihapus"
}
```

---

## Daftar Channel & Event

Berikut adalah daftar Channel dan Event yang bisa Anda di-listen di sisi Frontend:

| Entitas | Channel | Event Name | Tipe Payload | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| **Album** | `album-channel` | `album-updated` | Standar CRUD | Di-trigger saat Album dibuat, diupdate, atau dihapus. |
| **Bio** | `bio-channel` | `bio-updated` | Standar CRUD | Di-trigger saat Bio dibuat, diupdate, atau dihapus. |
| **Project** | `project-channel` | `project-updated` | Standar CRUD | Di-trigger saat Project dibuat, diupdate, atau dihapus. |
| **Achievement** | `achievement-channel` | `achievement-updated` | Standar CRUD | Di-trigger saat Achievement dibuat, diupdate, atau dihapus. |
| **Experience** | `experience-channel` | `experience-updated` | Standar CRUD | Di-trigger saat Experience dibuat, diupdate, atau dihapus. |
| **Tools Icon** | `tools-icon-channel` | `tools-icon-updated` | Standar CRUD | Di-trigger saat Tools Icon dibuat, diupdate, atau dihapus. |

---

## Khusus: Ranting (Rating / Voting)

Koleksi Ranting memiliki logika *real-time* yang sedikit berbeda karena sifatnya yang rekapitulasi data massal.

* **Channel**: `rating-channel`

**A. Event `rating-updated`**
Di-*trigger* secara otomatis **saat ada user yang men-submit rating baru** (`createRanting`).
* **Payload**: Mengembalikan **Array full** dari seluruh rekapitulasi ranting/rating terbaru.

```json
[
  { "_id": "6a11...", "rating": 5, "count": 120 },
  { "_id": "6a12...", "rating": 4, "count": 45 }
]
```

**B. Event `rating-data`**
Di-*trigger* **saat endpoint GET Ranting dipanggil** (`getRantings`). Gunanya untuk me-*refresh* data di semua klien yang aktif bersamaan.
* **Payload**: Sama seperti `rating-updated`, mengembalikan Array *full* dari rekapitulasi ranting/rating terbaru.
