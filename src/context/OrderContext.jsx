import { createContext, useContext, useState } from 'react'

const OrderContext = createContext(null)

const emptyDraft = {
  pharmacy: null,
  patient: { name: '', phone: '' },
  items: [{ name: '', dosage: '', qty: 1 }],
  notes: '',
  source: 'manual',
}

export function OrderProvider({ children }) {
  const [draft, setDraft] = useState(emptyDraft)
  const [orders, setOrders] = useState([])
  const [lastOrder, setLastOrder] = useState(null)

  function updateDraft(patch) {
    setDraft((d) => ({ ...d, ...patch }))
  }

  function resetDraft(patch = {}) {
    setDraft({
      ...emptyDraft,
      patient: { ...emptyDraft.patient },
      items: [{ ...emptyDraft.items[0] }],
      ...patch,
    })
  }

  function placeOrder() {
    const id = `#ZAZ-${Math.floor(100000 + Math.random() * 900000)}`
    const order = {
      id,
      pharmacy: draft.pharmacy,
      patient: draft.patient,
      items: draft.items.filter((i) => i.name.trim()),
      notes: draft.notes,
      source: draft.source,
      status: 'Processing',
      placedAt: new Date().toISOString(),
    }
    setOrders((o) => [order, ...o])
    setLastOrder(order)
    return order
  }

  return (
    <OrderContext.Provider
      value={{ draft, updateDraft, resetDraft, orders, placeOrder, lastOrder }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrder() {
  return useContext(OrderContext)
}
