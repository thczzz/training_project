import React from 'react'
import { PatientPerscription } from './Perscription'
import { get_examinations } from '../../Data/getData'

export const PatientExaminations = () => {
    const [examinations, setExaminations] = React.useState([]);
    const [page, setPage]                 = React.useState(1);
    const [loadMoreBtn, setLoadMoreBtn]   = React.useState(false);

    React.useEffect(() => {
        get_examinations(setExaminations, page, setPage, setLoadMoreBtn);
    }, [])

    function handleLoadMore(ev) {
        ev.preventDefault();
        get_examinations(setExaminations, page, setPage, setLoadMoreBtn);
    }

    const examinationContainer = (obj) => {
        const examination = obj["attributes"];

        return <div key={obj["id"]} class="aspect-tab">
                    <input id={"item-" + obj["id"]} type="checkbox" class="aspect-input" name="aspect"/>
                    <label for={"item-" + obj["id"]} class="aspect-label"></label>
                    <div class="aspect-content perscription_tab">
                        <div class="aspect-info">
                            <span class="aspect-name info">Examination - ({(new Date(Date.parse(examination["created_at"]))).toLocaleString()})</span>
                        </div>
                    </div>

                    {/* EXAMINATION CONTENT */}
                    <div class="aspect-tab-content">
                        <div class="sentiment-wrapper">

                            {/* EXAMINATION INFO */}
                            <div>
                                <div>
                                    <div className="positive-count opinion-header">
                                        <span>Examination info</span>
                                    </div>
                                    <div className="examination_description_content">
                                        <span>
                                            <p>Weight: {examination["weight_kg"]}</p>
                                            <p>Height: {examination["height_cm"]}</p>
                                            <p>Anamnesis: {examination["anamnesis"]}</p>
                                        </span>

                                    </div>
                                </div>
                            </div>
                            {/* END OF EXAMINATION INFO */}

                            <div className='perscrtiptions_container'>
                                
                                {examination["perscriptions"]["data"] ? (examination["perscriptions"]["data"].map((perscription) => {
                                    return PatientPerscription(perscription)
                                })) : ''}

                            </div>
                        </div>
                    </div>
                    {/* END OF EXAMINATION CONTENT */}
                </div>
    }

    return (
        <>
            <div id="aspect-content">
                {/* EXAMINATIONS */}

                {!examinations.length ? '' : (examinations.map((examination) => {
                    return examinationContainer(examination)
                }))}

                {/* END OF EXAMINATIONS */}

            </div>
            <div>
                <input 
                    type="button"
                    value="Load more"
                    onClick={(ev) => handleLoadMore(ev)}
                    disabled={loadMoreBtn}
                />
            </div>
        </>
    )
}