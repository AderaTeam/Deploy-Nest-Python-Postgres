import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
    
    public async processData(data: Record<string, any>)
    {
        let result ={
            "rational": 0,
            "unrational": 0,
            "trusting": 0,
            "untrusting": 0
    }
        
    }
}
