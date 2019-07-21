import React from 'react';

//<Pagination currentPage={currentPage} itemsPerPage={ itemsPerPage } length={customers.length} onPageChanged={handlePageChange} />
const Pagination = ({ currentPage, itemsPerPage, length, onPageChanged}) => {

    const pagesCount = Math.ceil(length / itemsPerPage);
    const pages = [];  
    for(let i= 1; i <= pagesCount; i++){
        pages.push(i);
    }

    return (<div>
                <ul className="pagination">
                  <li className={"page-item" + (currentPage === 1 && " disabled")}>
                    <button className="page-link" onClick={() => onPageChanged(currentPage -1)}>
                      &laquo;
                    </button>
                  </li>
                  {pages.map(page => 
                    <li key={page} className={"page-item " + (currentPage === page && " active")}>
                        <button  onClick={() => onPageChanged(page)} className="page-link">
                            {page}
                        </button>
                    </li>
                    )}
                  <li className={"page-item" + (currentPage === pagesCount && " disabled")}>
                    <button onClick={() => onPageChanged(currentPage +1)} className="page-link" >
                      &raquo;
                    </button>
                  </li>
                </ul>
             </div> );
}

/**
 * Créer une pagination
 * paramétres : les data, la page courrant, nombre d'item par page souhaité
 */
Pagination.getData = (items, currentPage, itemsPerPage) => {

    /**
     * Page courant x le nombre d'item par page - le nombre d'item par page
     *  p1 x ipp10 - ipp10 = start0, on part donc de 0 juska 0(start) + 10ipp et on récupére les 10 éléments  de 0 à 10
     *  du tableau.. p2 x ipp10 - ipp10 = start10, on part de l'élément start10 juska l'élémént 20 de 10 à 20 etc..
     * p = page
     * ipp= item par page
     * 
     */
    const start = currentPage * itemsPerPage - itemsPerPage;
     return items.slice(start, start + itemsPerPage);
}
export default Pagination;