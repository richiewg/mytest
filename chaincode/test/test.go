package main

//WARNING - this chaincode's ID is hard-coded in chaincode_example04 to illustrate one way of
//calling chaincode from a chaincode. If this example is modified, chaincode_example04.go has
//to be modified as well with the new ID of chaincode_example02.
//chaincode_example05 show's how chaincode ID can be passed in as a parameter instead of
//hard-coding.

import (
	"bytes"
	"encoding/binary"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"math"
	"net/http"
	"strings"

	"github.com/hyperledger/fabric/core/chaincode/shim"
)

const (
	FUNC_QUERY_DETAILS  = "QueryDetails"
	FUNC_QUERY_REGISTED = "QueryRegisted"
	FUNC_INVOKE_DELETE  = "InvokeDelete"
	FUNC_INVOKE_REGIST  = "InvokeRegist"
)

var ErrRange = errors.New("value out of range")
var ErrEof = errors.New("got EOF, can not get the next byte")

// SimpleChaincode example simple Chaincode implementation
type SimpleChaincode struct {
}

func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	var A, B, value string // Entities
	var err error

	if len(args) != 3 {
		return nil, errors.New("Incorrect number of arguments. Expecting 4" + args[0] + args[1] + args[2])
	}

	// Initialize the chaincode
	A = args[0]
	B = args[1]
	value = args[2]

	temp := A + B
	// Write the state to the ledger
	err = stub.PutState(temp, []byte(value))
	if err != nil {
		return nil, err
	}

	return nil, nil
}

// Transaction makes payment of X units from A to B
func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	switch function {
	case FUNC_INVOKE_DELETE:
		return t.InvokeDelete(stub, args)
	case FUNC_INVOKE_REGIST:
		return t.InvokeRegist(stub, args)
	}
	return nil, errors.New("Invalid Function Call:" + function)
}

// Deletes an entity from state
func (t *SimpleChaincode) InvokeDelete(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	if len(args) != 2 {
		return nil, errors.New("Incorrect number of arguments. Expecting 2")
	}

	A := args[0]
	B := args[1]

	temp := A + B

	// Delete the key from the state in ledger
	err := stub.DelState(temp)
	if err != nil {
		return nil, errors.New("Failed to delete state")
	}

	return nil, nil
}

func (t *SimpleChaincode) InvokeRegist(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var A, B, value string // Entities
	var err error

	if len(args) != 3 {
		return nil, errors.New("Incorrect number of arguments. Expecting 3" + args[0] + args[1] + args[2])
	}

	// Initialize the chaincode
	A = args[0]
	B = args[1]
	value = args[2]

	temp := A + B
	// Write the state to the ledger
	err = stub.PutState(temp, []byte(value))
	if err != nil {
		return nil, err
	}

	return nil, nil
}

// Query callback representing the query of a chaincode
func (t *SimpleChaincode) Query(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	switch function {
	case FUNC_QUERY_DETAILS:
		return t.QueryDetails(stub, function, args)
	case FUNC_QUERY_REGISTED:
		return t.QueryRegisted(stub, function, args)
	}
	return nil, errors.New("Invalid Function Call:" + function)
}

func (t *SimpleChaincode) QueryDetails(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	if function != "QueryDetails" {
		return nil, errors.New("Invalid query function name. Expecting \"query\"")
	}
	var identity string // Entities
	var err error

	if len(args) != 1 {
		return nil, errors.New("Incorrect number of arguments. Expecting name of the person to query")
	}

	identity = args[0]

	startKey := identity + "000000"
	endKey := identity + "999999"

	reply := []byte{}
	iter, err := stub.RangeQueryState(startKey, endKey)
	if err != nil {
		return nil, err
	}
	for iter.HasNext() {
		_, url, err := iter.Next()
		if err != nil {
			return nil, err
		}
		result, err := queryRemoteServer(string(url), identity)
		if err != nil {
			return []byte("Error with query remote server."), err
		}
		reply = append(reply, result...)
	}

	return []byte(reply), nil
}

func (t *SimpleChaincode) QueryRegisted(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	if function != "QueryRegisted" {
		return nil, errors.New("Invalid query function name. Expecting \"query\"")
	}
	var identity string // Entities
	var err error

	if len(args) != 1 {
		return nil, errors.New("Incorrect number of arguments. Expecting name of the person to query")
	}

	identity = args[0]

	startKey := identity + "000000"
	endKey := identity + "999999"

	reply := []byte{}
	iter, err := stub.RangeQueryState(startKey, endKey)
	if err != nil {
		return nil, err
	}
	for iter.HasNext() {
		key, url, err := iter.Next()
		if err != nil {
			return nil, err
		}
		jsonResp := "{\"identity\":\"" + identity + "\",\"key\":\"" + string(key) + "\",\"url\":\"" + string(url) + "\"}"
		reply = append(reply, jsonResp...)
	}

	return []byte(reply), nil
}

func queryRemoteServer(url string, identity string) (string, error) {
	urlx := "http://" + url
	payload := strings.NewReader("{\r\n  \"identity\": \"" + identity + "\"\r\n}")
	fmt.Println("URL IS :", urlx)
	fmt.Println("PAYLOAD IS:", payload)
	req, err := http.NewRequest("POST", urlx, payload)
	if err != nil {
		fmt.Println("999 error is :", req)
		return "", err
	}
	req.Header.Add("content-type", "application/json")
	req.Header.Add("cache-control", "no-cache")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()

	body, _ := ioutil.ReadAll(res.Body)
	replx := ReqUnmarshal(body)
	b_buf := new(bytes.Buffer)
	b_buf.WriteString(replx.Data.(string))
	detail := OutputDate{}
	detail.Deserialize(b_buf)
	jsonResp := "{\"identity\":\"" + detail.Identity + "\",\"userName\":\"" + detail.UserName + "\",\"money\":\"" + detail.Money + "\",\"txtype\":\"" + detail.Txtype + "\",\"date\":\"" + detail.Date + "\"}"
	return jsonResp, nil

}

func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}

func ReqUnmarshal(bs []byte) BaseJsonBean {
	var p1 BaseJsonBean
	err := json.Unmarshal(bs, &p1)
	if err != nil {
		fmt.Println("[ReqUnmarshal]Error with ReqUnmarshal", err)
		return BaseJsonBean{}
	}
	return p1

}

func BodyUnmarshal(bs []byte) {
	var p1 OutputDate
	err := json.Unmarshal(bs, &p1)
	if err != nil {
		fmt.Println("[ReqUnmarshal]Error with ReqUnmarshal", err)
		return
	}
}

type BaseJsonBean struct {
	Code    int         `json:"code"`
	Header  string      `json:"header"`
	Data    interface{} `json:"data"`
	Message string      `json:"message"`
}

type OutputDate struct {
	Identity string `json:"identity"`
	UserName string `json:"userName"`
	Money    string `json:"money"`
	Txtype   string `json:"txtype"`
	Date     string `json:"date"`
}

func (a *OutputDate) Deserialize(w io.Reader) error {
	a.Identity, _ = ReadVarString(w)
	a.UserName, _ = ReadVarString(w)
	a.Money, _ = ReadVarString(w)
	a.Txtype, _ = ReadVarString(w)
	a.Date, _ = ReadVarString(w)

	return nil
}

func WriteVarUint(writer io.Writer, value uint64) error {
	b_buf := new(bytes.Buffer)
	if value < 0xFD {
		valx := uint8(value)
		err := binary.Write(b_buf, binary.LittleEndian, valx)
		if err != nil {
			return err
		}
	} else if value <= 0xFFFF {
		err := b_buf.WriteByte(0xFD)
		if err != nil {
			return err
		}
		valx := uint16(value)
		err = binary.Write(b_buf, binary.LittleEndian, valx)
		if err != nil {
			return err
		}
	} else if value <= 0xFFFFFFFF {
		err := b_buf.WriteByte(0xFE)
		if err != nil {
			return err
		}
		valx := uint32(value)
		err = binary.Write(b_buf, binary.LittleEndian, valx)
		if err != nil {
			return err
		}
	} else {
		err := b_buf.WriteByte(0xFF)
		if err != nil {
			return err
		}
		valx := uint64(value)
		err = binary.Write(b_buf, binary.LittleEndian, valx)
		if err != nil {
			return err
		}
	}
	_, err := writer.Write(b_buf.Bytes())
	if err != nil {
		return err
	}
	return nil
}

func ReadVarBytes(reader io.Reader) ([]byte, error) {
	val, err := ReadVarUint(reader, 0)
	if err != nil {
		return nil, err
	}
	str, err := byteXReader(reader, val)
	if err != nil {
		return nil, err
	}
	return str, nil
}

func ReadVarString(reader io.Reader) (string, error) {
	val, err := ReadVarBytes(reader)
	if err != nil {
		return "", err
	}
	return string(val), nil
}

func WriteVarBytes(writer io.Writer, value []byte) error {
	err := WriteVarUint(writer, uint64(len(value)))
	if err != nil {
		return err
	}
	_, err = writer.Write(value)
	if err != nil {
		return err
	}
	return nil
}

func WriteVarString(writer io.Writer, value string) error {
	err := WriteVarUint(writer, uint64(len(value)))
	if err != nil {
		return err
	}
	_, err = writer.Write([]byte(value))
	if err != nil {
		return err
	}
	return nil
}

func ReadVarUint(r io.Reader, maxint uint64) (uint64, error) {
	if maxint == 0x00 {
		maxint = math.MaxUint64
	}
	fb, _ := byteReader(r)
	if bytes.Equal(fb, []byte{byte(0xfd)}) {
		val, err := ReadUint16(r)
		value := uint64(val)
		if err != nil {
			return 0, err
		}
		if value > maxint {
			return 0, ErrRange
		}
		return value, nil
	} else if bytes.Equal(fb, []byte{byte(0xfe)}) {
		val, err := ReadUint32(r)
		value := uint64(val)
		if err != nil {
			return 0, err
		}
		if value > maxint {
			return 0, ErrRange
		}
		return value, nil
	} else if bytes.Equal(fb, []byte{byte(0xff)}) {
		val, err := ReadUint64(r)
		value := uint64(val)
		if err != nil {
			return 0, err
		}
		if value > maxint {
			return 0, ErrRange
		}
		return value, nil
	} else {
		val, err := byteToUint8(fb)
		value := uint64(val)
		if err != nil {
			return 0, err
		}
		if value > maxint {
			return 0, ErrRange
		}
		return value, nil
	}

	return 0, nil
}

func ReadUint8(reader io.Reader) (uint8, error) {
	p := make([]byte, 1)
	n, err := reader.Read(p)
	if n <= 0 || err != nil {
		return 0, ErrEof
	}
	b_buf := bytes.NewBuffer(p)
	var x uint8
	binary.Read(b_buf, binary.LittleEndian, &x)
	return x, nil
}

func ReadUint16(reader io.Reader) (uint16, error) {
	p := make([]byte, 2)
	n, err := reader.Read(p)
	if n <= 0 || err != nil {
		return 0, ErrEof
	}
	b_buf := bytes.NewBuffer(p)
	var x uint16
	err = binary.Read(b_buf, binary.LittleEndian, &x)
	if err != nil {
		return 0, err
	}
	return x, nil
}

func ReadUint32(reader io.Reader) (uint32, error) {
	p := make([]byte, 4)
	n, err := reader.Read(p)
	if n <= 0 || err != nil {
		return 0, ErrEof
	}
	b_buf := bytes.NewBuffer(p)
	var x uint32
	err = binary.Read(b_buf, binary.LittleEndian, &x)
	if err != nil {
		return 0, err
	}
	return x, nil
}

func ReadUint64(reader io.Reader) (uint64, error) {
	p := make([]byte, 8)
	n, err := reader.Read(p)
	if n <= 0 || err != nil {
		return 0, ErrEof
	}
	b_buf := bytes.NewBuffer(p)
	var x uint64
	err = binary.Read(b_buf, binary.LittleEndian, &x)
	if err != nil {
		return 0, err
	}
	return x, nil
}

func WriteUint8(writer io.Writer, val uint8) error {
	err := binary.Write(writer, binary.LittleEndian, uint8(val))
	if err != nil {
		return err
	}
	return nil
}

func WriteUint16(writer io.Writer, val uint16) error {
	err := binary.Write(writer, binary.LittleEndian, uint16(val))
	if err != nil {
		return err
	}
	return nil
}

func WriteUint32(writer io.Writer, val uint32) error {
	err := binary.Write(writer, binary.LittleEndian, uint32(val))
	if err != nil {
		return err
	}
	return nil
}

func WriteUint64(writer io.Writer, val uint64) error {
	err := binary.Write(writer, binary.LittleEndian, uint64(val))
	if err != nil {
		return err
	}
	return nil
}

func byteReader(reader io.Reader) ([]byte, error) {
	p := make([]byte, 1)
	n, err := reader.Read(p)
	if n > 0 {
		return p[:], nil
	}
	return p, err
}

func byteXReader(reader io.Reader, x uint64) ([]byte, error) {
	p := make([]byte, x)
	n, err := reader.Read(p)
	if n > 0 {
		return p[:], nil
	}
	return p, err
}

func byteToUint8(bytex []byte) (uint8, error) {
	b_buf := bytes.NewBuffer(bytex)
	var x uint8
	err := binary.Read(b_buf, binary.LittleEndian, &x)
	if err != nil {
		return 0, err
	}
	return x, nil
}
