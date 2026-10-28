import { useEffect, useState } from "react"
import api from "@/services/api"
import Navbar from "@/components/Navbar"
import MedicineTable from "@/components/MedicineTable"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    name: "",
    manufacturer: "",
    quantity: "",
    expiryDate: "",
  })

  // Fetch medicines
  const fetchMedicines = async () => {
    try {
      const res = await api.get("/medicine/all")
      setMedicines(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedicines()
  }, [])

  // Add medicine
  const handleAddMedicine = async () => {
    try {
      await api.post("/medicine/add", form)
      fetchMedicines()
      setForm({
        name: "",
        manufacturer: "",
        quantity: "",
        expiryDate: "",
      })
      alert("Medicine added successfully")
    } catch (err) {
      alert(err.response?.data?.message || "Error adding medicine")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-6">
          Welcome {localStorage.getItem("ngoName")} !
        </h2>

        <Tabs defaultValue="view" className="bg-white p-6 rounded-md border">
          <TabsList className="mb-6">
            <TabsTrigger value="view">View Medicines</TabsTrigger>
            <TabsTrigger value="add">Add Medicine</TabsTrigger>
          </TabsList>

          {/* VIEW MEDICINES */}
          <TabsContent value="view">
            {loading ? (
              <p className="text-gray-500">Loading medicines...</p>
            ) : medicines.length === 0 ? (
              <p className="text-gray-500">No medicines found</p>
            ) : (
              <MedicineTable medicines={medicines} />
            )}
          </TabsContent>

          {/* ADD MEDICINE */}
          <TabsContent value="add">
            <div className="grid grid-cols-2 gap-4 max-w-xl">
              <Input
                placeholder="Medicine Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
              <Input
                placeholder="Manufacturer"
                value={form.manufacturer}
                onChange={(e) =>
                  setForm({ ...form, manufacturer: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Quantity"
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: e.target.value })
                }
              />
              <Input
                type="date"
                value={form.expiryDate}
                onChange={(e) =>
                  setForm({ ...form, expiryDate: e.target.value })
                }
              />

              <Button className="col-span-2 mt-4" onClick={handleAddMedicine}>
                Add Medicine
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
       {/* FOOTER */}
      <footer className="py-6 bg-white text-center text-gray-500 border-t border-gray-200">
        © {new Date().getFullYear()} AuthMed — All rights reserved.
      </footer>
    
    </div>
  )
}
