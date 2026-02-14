import React, { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useCompany } from '../contexts/CompanyContext'
import HiringList from '../components/hiring/HiringList'

const DashboardJobs = () => {
  const outletContext = useOutletContext()
  const outletCompany = outletContext?.selectedCompany
  const { selectedCompany, selectCompany } = useCompany()

  useEffect(() => {
    if (outletCompany && (!selectedCompany || selectedCompany.id !== outletCompany.id)) {
      selectCompany(outletCompany)
    }
  }, [outletCompany, selectedCompany, selectCompany])

  return <HiringList company={outletCompany || selectedCompany} />
}

export default DashboardJobs