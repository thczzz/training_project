export async function apiRequest(url, requestOptions) {
  const response = await fetch(url, {...requestOptions, credentials: 'include'})
  if (response.status === 401) {
    window.location = '/login';
    // todo: Add AuthErrorMessage (Your session has expired, you need to log in again)
  }
  return response
}

export function uniqueID() {
  return Math.floor(Math.random() * Date.now())
}

export function debounce(f, ms) {

    let timer = null;
  
    return function (...args) {
      const onComplete = () => {
        f.apply(this, args);
        timer = null;
      }
  
      if (timer) {
        clearTimeout(timer);
      }
  
      timer = setTimeout(onComplete, ms);
    };
}

export function search_user(url, setSearchResults, setInputId, setExaminationResults=null) {
  const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
  };

  return debounce((event) => {
      let userInput = event.target.value;
      if (userInput.length > 2) {
          apiRequest(url + userInput, requestOptions)
           .then(res => res.json())
           .then(
             (result) => {
                setSearchResults(result["data"]);
             },
             (error) => {
                console.log("Err");
             }
          );
      } else {
          // setInputId('');
          setSearchResults([]);
      }
      if (setExaminationResults !== null) {
        setExaminationResults([])
      }
  }, 400)
}


export function get_examinations(setExaminations, page, setPage, setLoadMoreBtn) {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  };

  apiRequest(`http://localhost:3000/api/v1/patients/examinations?page=${page}`, requestOptions)
  .then(res => res.json())
  .then(
    (result) => {
      setExaminations(prev => ( [...prev, ...result["data"]["data"]] ));
      if (result["next_page"] !== '') {
        setPage(result["next_page"]);
      } else {
        setLoadMoreBtn(true);
      }
      
    },
    (error) => {
      console.log("Err");
    }
  );
}
