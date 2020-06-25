sudo yum -y install httpd mod_ssl php wget
sudo mkdir -p /var/www/owlh
sudo chmod 755 /var/www/owlh/
sudo chcon -R -t httpd_sys_content_t /var/www/owlh
sudo setsebool -P httpd_can_network_connect 1
sudo cat > /etc/httpd/conf.d/owlh.conf <<\EOF
<VirtualHost *:80>
   ServerName master.owlh.net
   Redirect / https://localhost/
</VirtualHost>
<VirtualHost *:443>
        SSLEngine on
        SSLCertificateFile /usr/local/owlh/src/owlhmaster/conf/certs/ca.crt
        SSLCertificateKeyFile /usr/local/owlh/src/owlhmaster/conf/certs/ca.key
        <Directory /var/www/owlh>
           Header set Access-Control-Allow-Origin "*"
           DirectoryIndex index.html index.php
           AllowOverride All
        </Directory>
        DocumentRoot /var/www/owlh
        ServerName master.owlh.net
</VirtualHost>
EOF
export MYPUBIP=$(curl http://169.254.169.254/latest/meta-data/public-ipv4)
sed -i "s/<MASTERIP>/$MYPUBIP/g" /var/www/owlh/conf/ui.conf
chmod 666 /var/www/owlh/conf/ui.conf
#sysV
service httpd start
chkconfig httpd on
#systemd
systemctl start httpd