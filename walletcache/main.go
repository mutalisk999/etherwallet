package main

import (
	"io"
	"net/http"
	"os"
	"fmt"
	"bufio"
	"strings"
	"encoding/json"
	"errors"
	"strconv"
	"io/ioutil"
	"sort"
)

type ChainSource struct {
	FromChain string `json:"fromChain"`
}

type DelContract struct {
	ContractAddress string `json:"contractAddress"`
}

type DelTransaction struct {
	TxId string `json:"txId"`
}

type Contract struct {
	ContractAddress string `json:"contractAddress"`
	ContractName string `json:"contractName"`
	FromChain string `json:"fromChain"`
}

type Transaction struct {
	TxId string `json:"txId"`
	From string `json:"from"`
	TxTime string `json:"txTime"`
	ContractAddress string `json:"contractAddress"`
	To string `json:"to"`
	TxAmount float64 `json:"txAmount"`
	FromChain string `json:"fromChain"`
}

type ContractList []*Contract
type TransactionList []*Transaction

var contract_list ContractList
var transaction_list TransactionList
var contract_cachefile string = "contract_cache.dat"
var transaction_cachefile string = "transaction_cachefile.dat"


func (txlist TransactionList) Len() int {
	return len(txlist)
}

func (txlist TransactionList) Less(l, r int) bool {
	return txlist[l].TxTime > txlist[r].TxTime
}

func (txlist TransactionList) Swap(l, r int) {
	txlist[l], txlist[r] = txlist[r], txlist[l]
}

func FromRightChain(fromchain string) bool {
	if fromchain != "ETH" && fromchain != "ETC" {
		return false
	}
	return true
}

func ReadLinesToContracts(f *os.File) error {
	buf := bufio.NewReader(f)
	for {
		line, err := buf.ReadString('\n')
		if err != nil || io.EOF == err {
			break
		}
		line = strings.Trim(line, " \t\r\n")
		if line != "" {
			l := strings.Split(line, ",")
			if len(l) != 3 {
				return errors.New("contract_cache.dat: incorrect data format")
			}

			if !FromRightChain(l[2]) {
				return errors.New("contract_cache.dat: error fromChain field")
			}
			contract_list = append(contract_list, &Contract{l[0], l[1], l[2]})
		}
	}
	return nil
}

func ReadLinesToTransactions(f *os.File) error {
	buf := bufio.NewReader(f)
	for {
		line, err := buf.ReadString('\n')
		if err != nil || io.EOF == err {
			break
		}
		line = strings.Trim(line, " \t\r\n")
		if line != "" {
			l := strings.Split(line, ",")
			if len(l) != 7 {
				return errors.New("transaction_cachefile.dat: incorrect data format")
			}

			amount_float, err := strconv.ParseFloat(l[5], 64)
			if err != nil {
				return errors.New("transaction_cachefile.dat: can not convert string to float")
			}

			if !FromRightChain(l[6]) {
				return errors.New("transaction_cachefile.dat: error fromChain field")
			}
			transaction_list = append(transaction_list, &Transaction{l[0], l[1], l[2],
				l[3], l[4], amount_float, l[6]})
		}
	}
	sort.Sort(transaction_list)

	return nil
}

func InitLocalCache() error {
	var err error = nil
	var fp1 *os.File = nil
	var fp2 *os.File = nil

	defer fp1.Close()
	defer fp2.Close()

	fp1, err = os.OpenFile(contract_cachefile, os.O_RDWR|os.O_APPEND|os.O_CREATE, 0664)
	if err != nil {
		return err
	}

	err = ReadLinesToContracts(fp1)
	if err != nil {
		return err
	}

	fp2, err = os.OpenFile(transaction_cachefile, os.O_RDWR|os.O_APPEND|os.O_CREATE, 0664)
	if err != nil {
		return err
	}

	err = ReadLinesToTransactions(fp2)
	if err != nil {
		return err
	}

	return nil
}

func InitHandleFunc() {
	http.HandleFunc("/", HelloGoServer)
	http.HandleFunc("/saveContract", saveContract)
	http.HandleFunc("/delContract", delContract)
	http.HandleFunc("/contractList", contractList)
	http.HandleFunc("/saveTransaction", saveTransaction)
	http.HandleFunc("/delTransaction", delTransaction)
	http.HandleFunc("/transactionList", transactionList)
}

func SupportCrossDomain(w http.ResponseWriter) {
	w.Header().Add("content-type", "application:json;charset=utf8")
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Methods", "POST")
	w.Header().Add("Access-Control-Allow-Headers", "x-requested-with,content-type")
}

func HelloGoServer(w http.ResponseWriter, req *http.Request) {
	SupportCrossDomain(w)
	w.Write([]byte("Hello, this is a GoServer"))
}

func saveContract(w http.ResponseWriter, req *http.Request) {
	var new_contract Contract
	var err error
	var fp *os.File

	defer fp.Close()

	SupportCrossDomain(w)
	result, _:= ioutil.ReadAll(req.Body)
	req.Body.Close()
	err = json.Unmarshal(result, &new_contract)
	if err != nil {
		w.Write([]byte("{\"code\":\"201\"}"))
		return
	}

	for _, contract := range contract_list {
		if new_contract.ContractAddress == contract.ContractAddress {
			w.Write([]byte("{\"code\":\"201\"}"))
			return
		}

		if !FromRightChain(new_contract.FromChain) {
			w.Write([]byte("{\"code\":\"201\"}"))
			return
		}
	}

	contract_list = append(contract_list, &new_contract)
	fp, err = os.OpenFile(contract_cachefile, os.O_RDWR|os.O_TRUNC|os.O_CREATE, 0664)
	if err != nil {
		w.Write([]byte("{\"code\":\"201\"}"))
		return
	}

	for _, contract := range contract_list {
		fp.WriteString(contract.ContractAddress)
		fp.WriteString(",")
		fp.WriteString(contract.ContractName)
		fp.WriteString(",")
		fp.WriteString(contract.FromChain)
		fp.WriteString("\n")
	}

	w.Write([]byte("{\"code\":\"200\"}"))
}

func delContract(w http.ResponseWriter, req *http.Request) {
	var del_contract DelContract
	var err error
	var fp *os.File

	defer fp.Close()

	SupportCrossDomain(w)
	result, _:= ioutil.ReadAll(req.Body)
	req.Body.Close()
	err = json.Unmarshal(result, &del_contract)
	if err != nil {
		w.Write([]byte("{\"code\":\"201\"}"))
		return
	}

	for i, contract := range contract_list {
		if del_contract.ContractAddress == contract.ContractAddress {
			contract_list = append(contract_list[:i], contract_list[i+1:]...)
			break
		}
	}

	fp, err = os.OpenFile(contract_cachefile, os.O_RDWR|os.O_TRUNC|os.O_CREATE, 0664)
	if err != nil {
		w.Write([]byte("{\"code\":\"201\"}"))
		return
	}

	for _, contract := range contract_list {
		fp.WriteString(contract.ContractAddress)
		fp.WriteString(",")
		fp.WriteString(contract.ContractName)
		fp.WriteString(",")
		fp.WriteString(contract.FromChain)
		fp.WriteString("\n")
	}

	w.Write([]byte("{\"code\":\"200\"}"))
}


func contractList(w http.ResponseWriter, req *http.Request) {
	SupportCrossDomain(w)

	var chain_src ChainSource
	var err error
	var filted_contract_list ContractList
	result, _:= ioutil.ReadAll(req.Body)
	req.Body.Close()
	err = json.Unmarshal(result, &chain_src)
	if err != nil {
		w.Write([]byte("{\"code\":\"201\"}"))
		return
	}

	if !FromRightChain(chain_src.FromChain) {
		w.Write([]byte("{\"code\":\"201\"}"))
		return
	}

	for _, contract := range contract_list {
		if contract.FromChain == chain_src.FromChain {
			filted_contract_list = append(filted_contract_list, contract)
		}
	}

	data_stream, _ := json.Marshal(filted_contract_list)
	w.Write([]byte("{\"code\":\"200\",\"data\":"))
	w.Write(data_stream)
	w.Write([]byte("}"))
}

func saveTransaction(w http.ResponseWriter, req *http.Request) {
	var new_transaction Transaction
	var err error
	var fp *os.File

	defer fp.Close()

	SupportCrossDomain(w)
	result, _:= ioutil.ReadAll(req.Body)
	req.Body.Close()
	err = json.Unmarshal(result, &new_transaction)
	if err != nil {
		w.Write([]byte("{\"code\":\"201\"}"))
		return
	}

	for _, transaction := range transaction_list {
		if new_transaction.TxId == transaction.TxId {
			w.Write([]byte("{\"code\":\"201\"}"))
			return
		}

		if !FromRightChain(new_transaction.FromChain) {
			w.Write([]byte("{\"code\":\"201\"}"))
			return
		}
	}

	transaction_list = append(transaction_list, &new_transaction)
	sort.Sort(transaction_list)
	fp, err = os.OpenFile(transaction_cachefile, os.O_RDWR|os.O_TRUNC|os.O_CREATE, 0664)
	if err != nil {
		w.Write([]byte("{\"code\":\"201\"}"))
		return
	}

	for _, transaction := range transaction_list {
		fp.WriteString(transaction.TxId)
		fp.WriteString(",")
		fp.WriteString(transaction.From)
		fp.WriteString(",")
		fp.WriteString(transaction.TxTime)
		fp.WriteString(",")
		fp.WriteString(transaction.ContractAddress)
		fp.WriteString(",")
		fp.WriteString(transaction.To)
		fp.WriteString(",")
		fp.WriteString(strconv.FormatFloat(transaction.TxAmount, 'f', 8, 64))
		fp.WriteString(",")
		fp.WriteString(transaction.FromChain)
		fp.WriteString("\n")
	}

	w.Write([]byte("{\"code\":\"200\"}"))
}

func transactionList(w http.ResponseWriter, req *http.Request) {
	SupportCrossDomain(w)

	var chain_src ChainSource
	var err error
	var filted_transaction_list TransactionList
	result, _:= ioutil.ReadAll(req.Body)
	req.Body.Close()
	err = json.Unmarshal(result, &chain_src)
	if err != nil {
		w.Write([]byte("{\"code\":\"201\"}"))
		return
	}

	if !FromRightChain(chain_src.FromChain) {
		w.Write([]byte("{\"code\":\"201\"}"))
		return
	}

	for _, transaction := range transaction_list {
		if transaction.FromChain == chain_src.FromChain {
			filted_transaction_list = append(filted_transaction_list, transaction)
		}
	}

	data_stream, _ := json.Marshal(filted_transaction_list)
	w.Write([]byte("{\"code\":\"200\",\"data\":"))
	w.Write(data_stream)
	w.Write([]byte("}"))
}

func delTransaction(w http.ResponseWriter, req *http.Request) {
	var del_transaction DelTransaction
	var err error
	var fp *os.File

	defer fp.Close()

	SupportCrossDomain(w)
	result, _:= ioutil.ReadAll(req.Body)
	req.Body.Close()
	err = json.Unmarshal(result, &del_transaction)
	if err != nil {
		w.Write([]byte("{\"code\":\"201\"}"))
		return
	}

	for i, transaction := range transaction_list {
		if del_transaction.TxId == transaction.TxId {
			transaction_list = append(transaction_list[:i], transaction_list[i+1:]...)
			break
		}
	}

	sort.Sort(transaction_list)
	fp, err = os.OpenFile(transaction_cachefile, os.O_RDWR|os.O_TRUNC|os.O_CREATE, 0664)
	if err != nil {
		w.Write([]byte("{\"code\":\"201\"}"))
		return
	}

	for _, transaction := range transaction_list {
		fp.WriteString(transaction.TxId)
		fp.WriteString(",")
		fp.WriteString(transaction.From)
		fp.WriteString(",")
		fp.WriteString(transaction.TxTime)
		fp.WriteString(",")
		fp.WriteString(transaction.ContractAddress)
		fp.WriteString(",")
		fp.WriteString(transaction.To)
		fp.WriteString(",")
		fp.WriteString(strconv.FormatFloat(transaction.TxAmount, 'f', 8, 64))
		fp.WriteString(",")
		fp.WriteString(transaction.FromChain)
		fp.WriteString("\n")
	}

	w.Write([]byte("{\"code\":\"200\"}"))
}

func main() {
	var err error = nil

	fmt.Println("InitLocalCache Start...")
	err = InitLocalCache()
	if err != nil {
		fmt.Println(err)
		return
	}

	InitHandleFunc()

	fmt.Println("ListenAndServer Start...")
	err = http.ListenAndServe("127.0.0.1:30010", nil)
	if err != nil {
		fmt.Println(err)
		return
	}
}
