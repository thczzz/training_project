export function SearchExaminationTemplate({examinationResults}) {

    return (
        <div>
            <select id="dropdown" defaultValue="disabled" name="examination_id" required>
                <option value="disabled" disabled >{!examinationResults.length ? 'Nothing found' : "Select Patient's Examination"}</option>
                {examinationResults.map(itemArr => {
                    let date = (new Date(Date.parse(itemArr[1]))).toLocaleString()
                    return <option key={itemArr[0]} value={itemArr[0]}>Examination - ({date})</option>
                  }
                )}
            </select>
        </div>
    )

}