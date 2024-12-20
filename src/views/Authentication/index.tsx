import React, {
  useState,
  KeyboardEvent,
  useRef,
  ChangeEvent,
  useEffect,
} from 'react';
import './style.css';
import InputBox from 'components/InputBox';
import { CheckCertificationRequestDto, EmailCertificationRequestDto, IdCheckRequestDto, SignInRequestDto, SignUpRequestDto } from 'apis/request/auth';
import { checkCertificationRequest, EmailCertificationRequest, idCheckRequest, signInRequest, signUpRequest, SNS_SIGN_IN_URL } from 'apis';
import { CheckCertificationResponseDto, EmailCertificationResponseDto, IdCheckResponseDto, SignInResponseDto, SignUpResponseDto } from 'apis/response/auth';
import { ResponseDto } from 'apis/response';
import { useCookies } from 'react-cookie';
import { MAIN_PAHT } from 'constant';
import { useNavigate } from 'react-router-dom';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';
import { ResponseBody } from 'types';

//            component: 인증 화면 컴포넌트                //
export default function Authentication() {
  //            state: 화면 상태                //
  const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in');

  //            state: 쿠키 상태                //
  const [cookies, setCookies] = useCookies();

  //            function: 네비게이트 함수                //
  const navigate = useNavigate();

  //            component: sign in card 컴포넌트                //
  const SignInCard = () => {
    //            state: 아이디 요소 참조 상태              /
    const idRef = useRef<HTMLInputElement | null>(null);
    //            state: 패스워드 요소 참조 상태              /
    const passwordRef = useRef<HTMLInputElement | null>(null);

    //            state: 이메일 상태              //
    const [id, setId] = useState<string>('');
    //            state: 패스워드 상태              //
    const [password, setPassword] = useState<string>('');
    //            state: 패스워드 타입 상태              //
    const [passwordType, setPasswordType] = useState<'text' | 'password'>(
      'password'
    );
    //            state: 패스워드 버튼 아이콘 상태              //
    const [passwordButtonIcon, setPasswordButtonIcon] = useState<
      'eye-light-off-icon' | 'eye-light-on-icon'
    >('eye-light-off-icon');
    //            state: error 상태              //
    const [error, setError] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    //             function : sign in response 처리 함수          //
    const signInResponse = (
      responseBody: ResponseBody<SignInResponseDto>) => {
      if (!responseBody) {
        alert('네트워크 이상입니다.');
        return;
      }
      const { code } = responseBody;
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code === 'VF') alert('아이디와 비밀번호를 입력하세요.');
      if (code === 'SF') setMessage('로그인 정보가 일치하지 않습니다.');
      if (code !== 'SU') return;

      const { token, expirationTime } = responseBody as SignInResponseDto;
      const now = new Date().getTime();
      const expires = new Date(now + expirationTime * 1000);

      setCookies('accessToken', token, { expires, path: MAIN_PAHT() });
      navigate(MAIN_PAHT());
    };

    //            event handler : 아이디 변경 이벤트 처리            //
    const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      const { value } = event.target;
      setId(value);
      setMessage('');
    };

    //            event handler : 비밀번호 변경 이벤트 처리            //
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      const { value } = event.target;
      setPassword(value);
      setMessage('');
    };

    //            event handler : 로그인 버튼 클릭 이벤트 처리            //
    const onSignInButtonClickHandler = () => {

      if (!id || !password) {
        alert('아이디와 비밀번호 모두 입력하세요.');
        return;
      }

      const requestBody: SignInRequestDto = { id, password };
      signInRequest(requestBody).then(signInResponse);
    };

    //            event handler : sns 로그인 버튼 클릭 이벤트 처리            //
    const onSnsSignInButtomClickHandler = (type: 'kakao' | 'naver') => {
      window.location.href = SNS_SIGN_IN_URL(type);
    }

    //            event handler : 회원가입 링크 클릭 이벤트 처리            //
    const onSignUpLinkClickHandler = () => {
      setView('sign-up');
    };

    //            event handler : 패스워드 버튼 클릭 이벤트 처리            //
    const onPasswordButtonClickHandler = () => {
      if (passwordType === 'text') {
        setPasswordType('password');
        setPasswordButtonIcon('eye-light-off-icon');
      } else {
        setPasswordType('text');
        setPasswordButtonIcon('eye-light-on-icon');
      }
    };

    //            event handler : 아이디 인풋 키 다운 이벤트 처리            //
    const onIdKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      if (!passwordRef.current) return;
      passwordRef.current.focus();
    };

    //            event handler : 패스워드 키 다운 이벤트 처리            //
    const onPasswordKeyDownHandler = (
      event: KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key !== 'Enter') return;
      onSignInButtonClickHandler();
    };

    //            render:  sign in card  화면 렌더링                //
    return (
      <div className="auth-card">
        <div className="auth-card-box">
          <div className="auth-card-top">
            <div className="auth-card-title-box">
              <div className="auth-card-title">{'로그인'}</div>
            </div>
            <InputBox
              ref={idRef}
              label="아이디"
              type="text"
              placeholder="아이디를 입력해주세요."
              error={error}
              value={id}
              onChange={onIdChangeHandler}
              onKeyDown={onIdKeyDownHandler}
            />
            <InputBox
              ref={passwordRef}
              label="패스워드"
              type={passwordType}
              placeholder="비밀번호를 입력해주세요"
              error={error}
              value={password}
              onChange={onPasswordChangeHandler}
              icon={passwordButtonIcon}
              onButtonClick={onPasswordButtonClickHandler}
              onKeyDown={onPasswordKeyDownHandler}
            />
          </div>
          <div className="auth-card-bottom">
            {error && (
              <div className="auth-sign-in-error-box">
                <div className="auth-sign-in-error-message">
                  {
                    '아이디 또는 비밀번호를 잘못 입력했습니다. \n입력하신 내용을 다시 확인해주세요.'
                  }
                </div>
              </div>
            )}

            <div className='auth-sign-in-sns-button-box'>
              <div className='kakao-sign-in-button' onClick={() => onSnsSignInButtomClickHandler('kakao')}></div>
              <div className='naver-sign-in-button' onClick={() => onSnsSignInButtomClickHandler('naver')}></div>
            </div>
            <div
              className="black-large-full-button"
              onClick={onSignInButtonClickHandler}
            >
              {'로그인'}
            </div>
            <div className="auth-description-box">
              <div
                className="auth-descrpition"
                onClick={onSignUpLinkClickHandler}
              >
                {'신규 사용자이신가요? '}
                <span className="auth-description-link">{'회원가입'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  //            component: sign up card 컴포넌트                //
  const SignUpCard = () => {
    //            state: 아이디 요소 참조 상태              //
    const idRef = useRef<HTMLInputElement | null>(null);
    //            state: 이메일 요소 참조 상태              //
    const emailRef = useRef<HTMLInputElement | null>(null);
    //            state: 이메일 확인 요소 참조 상태              //
    const certificationNumberRef = useRef<HTMLInputElement | null>(null);
    //            state: 패스워드 요소 참조 상태              //
    const passwordRef = useRef<HTMLInputElement | null>(null);
    //            state: 패스워드 확인 요소 참조 상태              //
    const passwordCheckRef = useRef<HTMLInputElement | null>(null);
    //            state: 닉네임 요소 참조 상태              //
    const nicknameRef = useRef<HTMLInputElement | null>(null);
    //            state: 전화번호 요소 참조 상태              //
    const telNumberRef = useRef<HTMLInputElement | null>(null);
    //            state: 전화번호 요소 참조 상태              //
    const addressRef = useRef<HTMLInputElement | null>(null);
    //            state: 상세주소 요소 참조 상태              //
    const addressDetailRef = useRef<HTMLInputElement | null>(null);

    //           state : 페이지 번호 상태                //
    const [page, setPage] = useState<1 | 2>(1);
    //           state : 아이디 상태                //
    const [id , setId] = useState<string>('');
    //           state : 이메일 상태                //
    const [email, setEmail] = useState<string>('');
    //           state : 이메일 확인 상태                //
    const [certificationNumber, setCertificationNumber] = useState<string>('');
    //           state : 패스워드 상태                //
    const [password, setPassword] = useState<string>('');
    //           state : 패스워드 확인 상태                //
    const [passwordCheck, setpasswordCheck] = useState<string>('');
    //           state : 닉네임 상태                //
    const [nickname, setnickname] = useState<string>('');
    //           state : 핸드폰 번호 상태                //
    const [telNumber, setTelNumber] = useState<string>('');
    //           state : 주소 상태                //
    const [address, setAddress] = useState<string>('');
    //           state : 상세 주소 상태                //
    const [addressDetail, setAddressDetail] = useState<string>('');
    //           state : 개인 정보 동의 상태                //
    const [agreedPersonal, setAgreedPersonal] = useState<boolean>(false);

    //           state : 패스워드 타입 상태                //
    const [passwordType, setPasswordType] = useState<'text' | 'password'>(
      'password'
    );
    //           state : 패스워드 확인 타입 상태                //
    const [passwordCheckType, setpasswordCheckType] = useState<
      'text' | 'password'
    >('password');

    //           state : 아이디 에러 상태                //
    const [isIdError, setIdError] = useState<boolean>(false)
    //           state : 이메일 에러 상태                //
    const [isEmailError, setEmailError] = useState<boolean>(false);
    //           state : 이메일 확인 에러 상태                //
    const [isCertificationError, setCertificationError] = useState<boolean>(false);
    //           state : 패스워드 에러 상태                //
    const [isPasswordError, setPasswordError] = useState<boolean>(false);
    //           state : 패스워드 확인 에러 상태                //
    const [isPasswordCheckError, setPasswordCheckError] =
      useState<boolean>(false);
    //           state : 닉네임 에러 상태                //
    const [isNicknameError, setNicknameError] = useState<boolean>(false);
    //           state : 핸드폰 번호 에러 상태                //
    const [isTelNumberError, setTelNumberError] = useState<boolean>(false);
    //           state : 주소 에러 상태                //
    const [isAddressError, setAddressError] = useState<boolean>(false);
    //           state : 개인 정보 동의 에러 상태                //
    const [isAgreedPersonalError, setAgreedPersonalError] =
      useState<boolean>(false);

    //           state : 이메일 에러 메세지 상태                //
    const [idErrorMessage, setIdErrorMessage] = useState<string>('');
    //           state : 이메일 에러 메세지 상태                //
    const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');
    //           state : 이메일 확인 에러 메세지 상태                //
    const [certificationErrorMessage, setCertificationErrorMessage] = useState<string>('');
    //           state : 패스워드 에러 메세지 상태                //
    const [passwordErrorMessage, setPasswordErrorMessage] =
      useState<string>('');
    //           state : 패스워드 확인 에러 메세지 상태                //
    const [passwordCheckErrorMessage, setPasswordCheckErrorMessage] =
      useState<string>('');
    //           state : 닉네임 에러 메세지 상태                //
    const [nicknameErrorMessage, setNicknameErrorMessage] =
      useState<string>('');
    //           state : 핸드폰 번호 에러 메세지 상태                //
    const [telNumberErrorMessage, setTelNumberErrorMessage] =
      useState<string>('');
    //           state : 주소 에러 메세지 상태                //
    const [addressErrorMessage, setAddressErrorMessage] = useState<string>('');

    //           state : 아이디 체크                //
    const [isIdCheck, setIdCheck] = useState<boolean>(false);
    //           state : 인증번호 체크                //
    const [isCertificationCheck, setCertificationCheck] = useState<boolean>(false);

    //           state : 패스워드 버튼 아이콘 상태                //
    const [passwordButtonIcon, setPasswordButtonIcon] = useState<
      'eye-light-off-icon' | 'eye-light-on-icon'
    >('eye-light-off-icon');
    //           state : 패스워드 확인 버튼 아이콘 상태                //
    const [passwordCheckButtonIcon, setpasswordCheckButtonIcon] = useState<
      'eye-light-off-icon' | 'eye-light-on-icon'
    >('eye-light-off-icon');

    //           function : 다음 주소 검색 팝업 오픈 함수            //
    const open = useDaumPostcodePopup();

    //           function : sign Up response 처리 함수            //
    const signUpResponse = (
      responseBody: ResponseBody<SignUpResponseDto>
    ) => {
      if (!responseBody) {
        alert('네트워크 이상입니다');
        return;
      }

      const { code } = responseBody;
      if (code === 'DI') {
        setIdError(true);
        setIdErrorMessage('이미 사용중인 아이디 입니다');
        setIdCheck(false);
      }

      if (code === 'DE') {
        setEmailError(true);
        setEmailErrorMessage('중복되는 이메일 주소입니다.');
      }
      if (code === 'CF') {
        setCertificationError(true);
        setCertificationErrorMessage('인증번호가 일치하지 않습니다.');
        setCertificationCheck(false);
      };
      if (code === 'DN') {
        setNicknameError(true);
        setNicknameErrorMessage('중복되는 닉네임 입니다.');
      }
      if (code === 'DT') {
        setTelNumberError(true);
        setTelNumberErrorMessage('중복되는 핸드폰 번호입니다.');
      }
      if (code === 'VF') alert('모든 값을 입력하세요');
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') return;

      setView('sign-in');
    };

    const navigate = useNavigate();

    //           function : id check response 처리 함수            //
    const idcheckResponse = (responseBody: ResponseBody<IdCheckResponseDto>) => {
      if (!responseBody) return;

      const {code} = responseBody;
      if (code === 'VF') alert('아이디를 입력하세요.');
      if (code === 'DI') {
        setIdError(true);
        setIdErrorMessage('이미 사용중인 아이디 입니다.');
        setIdCheck(false);
      }
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') return;

      setIdError(false);
      setIdErrorMessage('사용 가능한 아이디 입니다.');
      setIdCheck(true);
    };

    //           function : email certification response 처리 함수            //
    const EmailCertificationResponse = (responseBody: ResponseBody<EmailCertificationResponseDto>) => {
      if (!responseBody) return;

      const {code} = responseBody;
      if (code === 'VF') alert('아이디와 이메일을 모두 입력하세요.');
      if (code === 'DI') {
        setIdError(true);
        setIdErrorMessage('이미 사용중인 아이디 입니다.');
        setIdCheck(false);
      };
      if (code === 'MF') alert('이메일 전송에 실패했습니다');
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') return;

      setEmailError(false);
      setEmailErrorMessage('인증번호가 전송되었습니다.');
    };

    //           function : check certification response 처리 함수            //
    const checkCertificationResponse  = (responseBody: ResponseBody<CheckCertificationResponseDto>) => {
      if (!responseBody) return;

      const {code} = responseBody;
      if (code === 'VF') alert('아이디, 이메일, 인증번호를 모두 입력하세요.');
      if (code === 'CF') {
        setCertificationError(true);
        setCertificationErrorMessage('인증번호가 일치하지 않습니다.');
        setCertificationCheck(false);
      };
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') return;

      setCertificationError(false);
      setCertificationErrorMessage('인증번호가 확인되었습니다.');
      setCertificationCheck(true);
    };

    //           event handler : 아이디 변경 이벤트 처리             //
    const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const {value} = event.target;
      setId(value);
      setIdErrorMessage('');
      setIdCheck(false);
    }; 
    //           event handler : 이메일 변경 이벤트 처리             //
    const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setEmail(value);
      setEmailError(false);
      setEmailErrorMessage('');
    };
    //           event handler : 패스워드 변경 이벤트 처리             //
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setPassword(value);
      setPasswordError(false);
      setPasswordErrorMessage('');
    };
    //           event handler : 패스워드 확인 변경 이벤트 처리             //
    const onPasswordCheckChangeHandler = (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const { value } = event.target;
      setpasswordCheck(value);
      setPasswordCheckError(false);
      setPasswordCheckErrorMessage('');
    };
    //           event handler : 이메일 확인 변경 이벤트 처리             //
    const onCertificationNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const {value} = event.target;
      setCertificationNumber(value);
      setCertificationErrorMessage('');
      setCertificationCheck(false);
    }; 
    //           event handler : 닉네임 변경 이벤트 처리             //
    const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setnickname(value);
      setNicknameError(false);
      setNicknameErrorMessage('');
    };
    //           event handler : 핸드폰 번호 변경 이벤트 처리             //
    const onTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setTelNumber(value);
      setTelNumberError(false);
      setTelNumberErrorMessage('');
    };
    //           event handler : 주소 변경 이벤트 처리             //
    const onAddressChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setAddress(value);
      setAddressError(false);
      setAddressErrorMessage('');
    };
    //           event handler : 상세주소 변경 이벤트 처리             //
    const onAddressDetailChangeHandler = (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const { value } = event.target;
      setAddressDetail(value);
    };

    //           event handler : 개인 정보 동의 클릭 버튼 이벤트 처리             //
    const onAgreedPersonalClickHandler = () => {
      setAgreedPersonal(!agreedPersonal);
      setAgreedPersonalError(false);
    };

    //           event handler : 아이디 중복 확인 버튼 클릭 이벤트 처리             //
    const onIdButtonClickHandler = () => {
      if(!id) return;
      const requestBody: IdCheckRequestDto = { id };
      
      idCheckRequest(requestBody).then(idcheckResponse);
    };
    //           event handler : 이메일 버튼 클릭 이벤트 처리             //
    const onEmailButtonClickHandler = () => {
      if(!id && !email) return;

      const emailpattern = /^[a-zA-Z0-9]*@[-.]?[a-zA-Z0-9]*\.[a-zA-Z]{2,4}$/;
      const isEmailPattern = emailpattern.test(email);
      if (!isEmailPattern) {
        setEmailError(true);
        setEmailErrorMessage('이메일 주소 포멧이 맞지 않습니다.');
        return;
      }

      const requestBody: EmailCertificationRequestDto = {id, email};
      EmailCertificationRequest(requestBody).then(EmailCertificationResponse);

      setEmailError(false);
      setEmailErrorMessage('이메일 전송중...');

    };
    //           event handler : 이메일 인증 버튼 클릭 이벤트 처리             //
    const onCertificationNumberButtonClickHandler = () => {
      if (!id && !email && !certificationNumber) return;

      const requestBody: CheckCertificationRequestDto = {id, email, certificationNumber};
      checkCertificationRequest(requestBody).then(checkCertificationResponse);
    };


    //           event handler : 패스워드 버튼 클릭 이벤트 처리             //
    const onPasswordButtonClickHandler = () => {
      if (passwordButtonIcon === 'eye-light-off-icon') {
        setPasswordButtonIcon('eye-light-on-icon');
        setPasswordType('text');
      } else {
        setPasswordButtonIcon('eye-light-off-icon');
        setPasswordType('password');
      }
    };
    //           event handler :  패스워드 확인 버튼 클릭 이벤트 처리             //
    const onPasswordCheckButtonClickHandler = () => {
      if (passwordCheckButtonIcon === 'eye-light-off-icon') {
        setpasswordCheckButtonIcon('eye-light-on-icon');
        setpasswordCheckType('text');
      } else {
        setpasswordCheckButtonIcon('eye-light-off-icon');
        setpasswordCheckType('password');
      }
    };
    //           event handler :  주소 버튼 클릭 이벤트 처리             //
    const onAddressButtonClickHandler = () => {
      open({ onComplete });
    };
    //           event handler :  다음 단계 버튼 클릭 이벤트 처리             //
    const onNextButtonClickHandler = () => {

      const isCheckedId = id.trim().length > 0;
      if (!isCheckedId) {
        setIdError(true);
        setIdErrorMessage('아이디를 입력해주세요');
      }
      if (isCheckedId && !isIdCheck) {
        alert('아이디 중복 확인은 필수입니다.');
        return;
      }

      const isCheckedPassword = password.trim().length >= 8;
      if (!isCheckedPassword) {
        setPasswordError(true);
        setPasswordErrorMessage('비밀번호는 8자 이상 입력해주세요.');
      }

      const isEqualPassword = password === passwordCheck;
      if (!isEqualPassword) {
        setPasswordCheckError(true);
        setPasswordCheckErrorMessage('비밀번호가 일치하지 않습니다.');
      }

      const isCheckedEmail = email.trim().length > 0;
      if (!isCheckedEmail) {
        setEmailError(true);
        setEmailErrorMessage('이메일을 입력해주세요.');
      }

      if (!isCertificationCheck) {
        setCertificationError(true);
        setCertificationErrorMessage('이메일 인증은 필수입니다.')
      }

      if (!isCheckedId || !isCheckedEmail ||  !isCheckedPassword || !isEqualPassword || !isCertificationCheck) return;

      setPage(2);
    };
    //           event handler :  회원가입 버튼 클릭 이벤트 처리             //
    const onSignUpButtonClickHandler = () => {

      if (!isIdCheck) {
        alert('아이디 중복 확인은 필수입니다.');
        return;
      }

      const emailPattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const isEmailPattern = emailPattern.test(email);
      if (!isEmailPattern) {
        setEmailError(true);
        setEmailErrorMessage('이메일 주소 포맷이 맞지 않습니다.');
      }

      const isCheckedPassword = password.trim().length >= 8;
      if (!isCheckedPassword) {
        setPasswordError(true);
        setPasswordErrorMessage('비밀번호는 8자 이상 입력해주세요.');
        return;
      }

      const isEqualPassword = password === passwordCheck;
      if (!isEqualPassword) {
        setPasswordCheckError(true);
        setPasswordCheckErrorMessage('비밀번호가 일치하지 않습니다.');
        return;
      }

      if (!isEmailPattern || !isCheckedPassword || !isEqualPassword) {
        setPage(1);
        return;
      }

      const hasNickname = nickname.trim().length !== 0;
      if (!hasNickname) {
        setNicknameError(true);
        setNicknameErrorMessage('닉네임을 입력해주세요.');
      }

      const telNumberPattern = /^[0-9]{11,13}$/;
      const isTelNumberPattern = telNumberPattern.test(telNumber);
      if (!isTelNumberPattern) {
        setTelNumberError(true);
        setTelNumberErrorMessage('숫자만 입력해주세요.');
      }

      const hasAddress = address.trim().length > 0;
      if (!hasAddress) {
        setAddressError(true);
        setAddressErrorMessage('주소를 선택해 주세요.');
      }

      if (!agreedPersonal) {
        setAgreedPersonalError(true);
      }

      if (!hasNickname || !isTelNumberPattern || !hasAddress || !agreedPersonal)
        return;

      const requestBody: SignUpRequestDto = {
        id,
        email,
        password,
        certificationNumber,
        nickname,
        telNumber,
        address,
        addressDetail,
        agreedPersonal,
      };


      signUpRequest(requestBody).then((response) =>
        signUpResponse(response as SignUpResponseDto | ResponseDto | null)
      );
    };

    //           event handler :  로그인 클릭 이벤트 처리             //
    const onSignInLinkClickHandler = () => {
      setView('sign-in');
    };

    //           event handler :  아이디 키 다운 이벤트 처리             //
    const onIdKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      onIdButtonClickHandler();
    };
    //           event handler :  이메일 키 다운 이벤트 처리             //
    const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      onEmailButtonClickHandler();
      // if (!emailRef.current) return;
      // emailRef.current.focus();
    };
    //           event handler :  이메일 키 다운 이벤트 처리             //
    const onCertificationNumberKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      onCertificationNumberButtonClickHandler();
    };
    //           event handler :  패스워드 키 다운 이벤트 처리             //
    const onPasswordKeyDownHandler = (
      event: KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key !== 'Enter') return;
      if (!passwordRef.current) return;
      passwordRef.current.focus();
    };
    //           event handler :  패스워드 확인 키 다운 이벤트 처리             //
    const onPasswordCheckKeyDownHandler = (
      event: KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key !== 'Enter') return;
      onNextButtonClickHandler();
    };

    //           event handler :  닉네임 키 다운 이벤트 처리             //
    const onNicknameKeyDownHandler = (
      event: KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key !== 'Enter') return;
      if (!telNumberRef.current) return;
      telNumberRef.current.focus();
    };
    //           event handler :  핸드폰 번호 키 다운 이벤트 처리             //
    const onTelNumberKeyDownHandler = (
      event: KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key !== 'Enter') return;
      onAddressButtonClickHandler();
    };
    //           event handler :  주소 키 다운 이벤트 처리             //
    const onAddressKeyDownHandler = (
      event: KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key !== 'Enter') return;
      if (!addressDetailRef.current) return;
      addressDetailRef.current.focus();
    };
    //           event handler :  상세주소 키 다운 이벤트 처리             //
    const onAddressDetailKeyDownHandler = (
      event: KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key !== 'Enter') return;
      onSignUpButtonClickHandler();
    };

    //           event handler :  다음 주소 검색 완료 이벤트 처리             //
    const onComplete = (data: Address) => {
      const { address } = data;
      setAddress(address);
      setAddressError(false);
      setAddressErrorMessage('');
      if (!addressDetailRef.current) return;
      addressDetailRef.current.focus();
    };

    

    //           effect :  페이지가 변경될 때 마다 실행될 함수             //
    useEffect(() => {
      if (page === 2) {
        if (!nicknameRef.current) return;
        nicknameRef.current.focus();
      }
    }, [page]);

    //            render: sign up card 화면 렌더링                //
    return (
      <div className="auth-card">
        <div className="auth-card-box">
          <div className="auth-card-top">
            <div className="auth-card-title-box">
              <div className="auth-card-title">{'회원가입'}</div>
              <div className="auth-card-page">{`${page}/2`}</div>
            </div>
            {page === 1 && (
              <>
                <InputBox
                  ref={idRef}
                  label="아이디*"
                  type="text"
                  placeholder="아이디를 입력해주세요."
                  value={id}
                  onChange={onIdChangeHandler}
                  buttonTitle='중복 확인'
                  onButtonClick={onIdButtonClickHandler}
                  error={isIdError}
                  message={idErrorMessage}
                  onKeyDown={onIdKeyDownHandler}
                />
                <InputBox
                  ref={passwordRef}
                  label="비밀번호*"
                  type={passwordType}
                  placeholder="비밀번호를 입력해주세요."
                  value={password}
                  onChange={onPasswordChangeHandler}
                  error={isPasswordError}
                  message={passwordErrorMessage}
                  icon={passwordButtonIcon}
                  onButtonClick={onPasswordButtonClickHandler}
                  onKeyDown={onPasswordKeyDownHandler}
                />
                <InputBox
                  ref={passwordCheckRef}
                  label="비밀번호 확인*"
                  type={passwordCheckType}
                  placeholder="비밀번호를 다시 입력해주세요."
                  value={passwordCheck}
                  onChange={onPasswordCheckChangeHandler}
                  error={isPasswordCheckError}
                  message={passwordCheckErrorMessage}
                  icon={passwordCheckButtonIcon}
                  onButtonClick={onPasswordCheckButtonClickHandler}
                  onKeyDown={onPasswordCheckKeyDownHandler}
                />
                <InputBox
                  ref={emailRef}
                  label="이메일 주소*"
                  type="text"
                  placeholder="이메일 주소를 입력해주세요."
                  value={email}
                  onChange={onEmailChangeHandler}
                  buttonTitle='이메일 인증'
                  error={isEmailError}
                  message={emailErrorMessage}
                  onButtonClick={onEmailButtonClickHandler}
                  onKeyDown={onEmailKeyDownHandler}
                />
                <InputBox
                  ref={certificationNumberRef}
                  label="인증번호*"
                  type="text"
                  placeholder="인증번호 4자리를 입력해주세요."
                  value={certificationNumber}
                  onChange={onCertificationNumberChangeHandler}
                  buttonTitle='인증 확인'
                  error={isCertificationError}
                  message={certificationErrorMessage}
                  onButtonClick={onCertificationNumberButtonClickHandler}
                  onKeyDown={onCertificationNumberKeyDownHandler}
                />
              </>
            )}
            {page === 2 && (
              <>
                <InputBox
                  ref={nicknameRef}
                  label="닉네임*"
                  type="text"
                  placeholder="닉네임을 입력해주세요."
                  value={nickname}
                  onChange={onNicknameChangeHandler}
                  error={isNicknameError}
                  message={nicknameErrorMessage}
                  onKeyDown={onNicknameKeyDownHandler}
                />
                <InputBox
                  ref={telNumberRef}
                  label="핸드폰 번호*"
                  type="text"
                  placeholder="핸드폰 번호를 입력해주세요."
                  value={telNumber}
                  onChange={onTelNumberChangeHandler}
                  error={isTelNumberError}
                  message={telNumberErrorMessage}
                  onKeyDown={onTelNumberKeyDownHandler}
                />
                <InputBox
                  ref={addressRef}
                  label="주소*"
                  type="text"
                  placeholder="우편번호 찾기"
                  value={address}
                  onChange={onAddressChangeHandler}
                  error={isAddressError}
                  message={addressErrorMessage}
                  icon="expand-right-light-icon"
                  onButtonClick={onAddressButtonClickHandler}
                  onKeyDown={onAddressKeyDownHandler}
                />
                <InputBox
                  ref={addressDetailRef}
                  label="상세 주소"
                  type="text"
                  placeholder="상세주소를 입력해주세요"
                  value={addressDetail}
                  onChange={onAddressDetailChangeHandler}
                  error={false}
                  onKeyDown={onAddressDetailKeyDownHandler}
                />
              </>
            )}
          </div>
          <div className="auth-card-bottom">
            {page === 1 && (
              <div
                className="black-large-full-button"
                onClick={onNextButtonClickHandler}
              >
                {'다음 단계'}
              </div>
            )}
            {page === 2 && (
              <>
                <div className="auth-consent-box">
                  <div
                    className="auth-check-box"
                    onClick={onAgreedPersonalClickHandler}
                  >
                    <div
                      className={`icon ${
                        agreedPersonal
                          ? 'check-round-fill-icon'
                          : 'check-ring-light-icon'
                      }`}
                    ></div>
                  </div>
                  <div
                    className={
                      isAgreedPersonalError
                        ? 'auth-consent-title-error'
                        : 'auth-consent-title'
                    }
                  >
                    {'개인정보동의'}
                  </div>
                  <div className="auth-consent-link">{'더보기 >'}</div>
                </div>
                <div
                  className="black-large-full-button"
                  onClick={onSignUpButtonClickHandler}
                >
                  {'회원가입'}
                </div>
              </>
            )}
            <div className="auth-description-box">
              <div className="auth-descrpition">
                {'이미 계정이 있으신가요? '}
                <span
                  className="auth-description-link"
                  onClick={onSignInLinkClickHandler}
                >
                  {'로그인'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  //            render: 인증 화면 렌더링                //
  return (
    <div id="auth-wrapper">
      <div className="auth-container">
        <div className="auth-jumbotron-box">
          <div className="auth-jumbotron-contents">
            <div className="auth-logo-icon"></div>
            <div className="auth-jumbotron-text-box">
              <div className="auth-jumbotron-text">{'환영합니다.'}</div>
              <div className="auth-jumbotron-text">{'HYEON`s BOARD'}</div>
            </div>
          </div>
        </div>
        {view === 'sign-in' && <SignInCard />}
        {view === 'sign-up' && <SignUpCard />}
      </div>
    </div>
  );
}
