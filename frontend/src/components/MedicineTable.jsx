import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const isExpired = (date) => new Date(date) < new Date()

const daysLeft = (date) => {
  const diff = new Date(date) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) // convert ms to days
}

export default function MedicineTable({ medicines }) {
  return (
    <div className="overflow-x-auto border rounded-lg shadow-md">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="px-4 py-2">Name</TableHead>
            <TableHead className="px-4 py-2">Manufacturer</TableHead>
            <TableHead className="px-4 py-2">Quantity</TableHead>
            <TableHead className="px-4 py-2">Expiry Date</TableHead>
            <TableHead className="px-4 py-2">Expiring In</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {medicines.map((med) => {
            const left = daysLeft(med.expiryDate)
            return (
              <TableRow
                key={med.medicineId}
                className="hover:bg-gray-50 transition"
              >
                <TableCell className="px-4 py-2">{med.name}</TableCell>
                <TableCell className="px-4 py-2">{med.manufacturer}</TableCell>
                <TableCell className="px-4 py-2">{med.quantity}</TableCell>
                <TableCell
                  className={`px-4 py-2 ${
                    isExpired(med.expiryDate) ? "text-red-600 font-medium" : ""
                  }`}
                >
                  {med.expiryDate}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 ${
                    left <= 8 ? "text-red-600 font-semibold" : ""
                  }`}
                >
                  {left > 0 ? `${left} day${left > 1 ? "s" : ""}` : "Expired"}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
