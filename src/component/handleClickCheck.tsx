///////////////////////////////////////////////////////////////////////////////
//
//fetchDataを使うのでapi_req.tsxをimport
//
///////////////////////////////////////////////////////////////////////////////
import fetchData from './api_req';
///////////////////////////////////////////////////////////////////////////////
//
//handleCheckClick                        
//仕様       引数                                   説明                                  
//          api_population + String(prefCode)     :都道府県のコードを加えたURL              
//          selectedData                          :selectで選択した内容,デフォルトで総人口 　
//          prefPopulation                        :取得された都道府県データを入れます
//          setPrefPopulation                     :取得された都道府県データを入れますsetするのに使います
//          prefName                              ：都道府県名    
//          prefCode                              :都道府県コード    
//          check                                 :クリックに関する       
//
///////////////////////////////////////////////////////////////////////////////
const handleClickCheck = (
    url: string,
    select_type: string,
    prefPopulation: { prefName: string; data: { label: string; data: { year: number; value: number; }[]; }[] }[],
    setPrefPopulation: React.Dispatch<
        React.SetStateAction<{ prefName: string; data: { label: string; data: { year: number; value: number; }[]; }[] }[]>
    >,
    prefName: string,
    prefCode: number,
    check: boolean
) => {
    console.log(select_type);


    let c_prefPopulation = prefPopulation.slice();

    if (check) {

        fetchData(url)
            .then((response) => {
                c_prefPopulation.push({
                    prefName: prefName,                         //都道府県の名前
                    data: response.result.data,                 //ここでは人口に関するすべてのデータを取得している
                });
                setPrefPopulation(c_prefPopulation);
            })
            .catch((error) => {
                console.error(error);
            });
    } else {
        const deleteIndex = c_prefPopulation.findIndex((value) => value.prefName === prefName);
        if (deleteIndex === -1) {
            return;
        }
        c_prefPopulation.splice(deleteIndex, 1);
        setPrefPopulation(c_prefPopulation);
    }
};
///////////////////////////////////////////////////////////////////////////////
//
//
//
///////////////////////////////////////////////////////////////////////////////
export default handleClickCheck;
///////////////////////////////////////////////////////////////////////////////
//
//EOF
//
///////////////////////////////////////////////////////////////////////////////


