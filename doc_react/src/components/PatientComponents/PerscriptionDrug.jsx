import { uniqueID } from "../../Data/getData"

export const perscriptionDrugContainer = (obj, idx) => {
    const perscription_drug = obj["attributes"]
    const unique_id = uniqueID();

    return <div key={"itemd-" + unique_id} class="aspect-tab ">
                <input id={"itemd-" + unique_id} type="checkbox" class="aspect-input" name="aspect"/>
                <label for={"itemd-" + unique_id} class="aspect-label"></label>
                <div class="aspect-content drugtab">
                    <div class="aspect-info">
                        <span class="aspect-name info">{perscription_drug["drug"]["data"]["attributes"]["name"]}</span>
                    </div>
                </div>
                <div class="aspect-tab-content">
                    

                        <div className='perscriptions_list_info perscription_content'>
                            <div className='drug_usage_description'>
                                <div class="opinion-header">
                                    <span><strong>Usage description:</strong></span>
                                </div>
                                
                                <div>
                                    <span>{perscription_drug["usage_description"]}</span>
                                </div>
                            </div>
                        </div>
                    
                </div>
            </div>
}
