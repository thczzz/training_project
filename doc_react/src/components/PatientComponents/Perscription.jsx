import { perscriptionDrugContainer } from "./PerscriptionDrug";

export const PatientPerscription = (obj) => {
    const perscription = obj["attributes"];
    const perscription_drugs = perscription["perscription_drugs"]["data"]

    return <div key={"itemp-" + obj["id"]} className="aspect-tab">
        <input id={"itemp-" + obj["id"]} type="checkbox" class="aspect-input" name="aspect"/>
        <label for={"itemp-" + obj["id"]} class="aspect-label"></label>
        <div class="aspect-content perscription_tab">
            <div class="aspect-info">
                <span class="aspect-name info">Perscription - {(new Date(Date.parse(perscription["created_at"]))).toLocaleString()}</span>
            </div>
        </div>

        {/* Perscription Content */}
        <div className='aspect-tab-content perscription_content'>
            <div className='inner'>
                <div>
                    <div className='aspect-tab'>

                        {/* Perscription Description */}
                        <div class="opinion-header perscription-description">
                            <span>Description</span>
                        </div>
                        <div className='perscription-description-content'>
                            <span>{perscription["description"]}</span>
                        </div>
                        {/* Perscription Description */}

                    </div>

                    {perscription_drugs.map((obj, idx) => {
                        return perscriptionDrugContainer(obj, idx);
                    })}

                </div>
            </div>
        </div>
        {/*END OF Perscription Content */}
    </div>
}
