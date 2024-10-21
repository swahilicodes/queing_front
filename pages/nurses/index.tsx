import React from 'react'
import Select from '@/reusables/select/select'

function Nurses() {
    const options = [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'cherry', label: 'Cherry' },
        { value: 'date', label: 'Date' },
        { value: 'elderberry', label: 'Elderberry' },
      ];
  return (
    <div>
        <Select
        options={options}
        placeholder='search..'
        />
    </div>
  )
}

export default Nurses